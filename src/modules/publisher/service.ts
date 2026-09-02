import { prisma } from "@/lib/db";
import { connectorRegistry } from "../connectors/registry";
import { SupportedFormat } from "../connectors/types";

export class PublisherService {
  /**
   * Annule une occurrence en cours ou programmée
   * Valable tant que la requête API finale n'a pas été envoyée (ex: en PREPARING)
   */
  async cancelOccurrence(occurrenceId: string, userId?: string) {
    const occurrence = await prisma.publicationOccurrence.findUnique({
      where: { id: occurrenceId },
    });

    if (!occurrence) {
      throw new Error("Occurrence introuvable.");
    }

    if (
      occurrence.status !== "SCHEDULED" &&
      occurrence.status !== "NEEDS_APPROVAL" &&
      occurrence.status !== "APPROVED" &&
      occurrence.status !== "PREPARING"
    ) {
      throw new Error(`Impossible d'annuler une publication en état ${occurrence.status}.`);
    }

    const updated = await prisma.publicationOccurrence.update({
      where: { id: occurrenceId },
      data: {
        status: "CANCELLED",
        targets: {
          updateMany: {
            where: { status: { in: ["PENDING", "PROCESSING"] } },
            data: { status: "CANCELLED" },
          },
        },
      },
    });

    // Journal d'audit
    await prisma.auditLog.create({
      data: {
        action: "CANCEL_OCCURRENCE",
        targetType: "OCCURRENCE",
        targetId: occurrenceId,
        userId: userId ?? occurrence.approvedByUserId,
        details: { previousStatus: occurrence.status },
      },
    });

    return updated;
  }

  /**
   * Exécute la publication d'une occurrence vers l'ensemble de ses cibles
   */
  async executeOccurrence(occurrenceId: string) {
    const occurrence = await prisma.publicationOccurrence.findUnique({
      where: { id: occurrenceId },
      include: {
        variant: {
          include: {
            assets: {
              include: {
                asset: true,
                rendition: true,
              },
            },
          },
        },
        targets: {
          include: {
            channelConnection: true,
          },
        },
      },
    });

    if (!occurrence) {
      throw new Error(`Occurrence ${occurrenceId} introuvable.`);
    }

    if (occurrence.status === "CANCELLED") {
      return { status: "CANCELLED", message: "Publication annulée." };
    }

    // 1. Passage en PREPARING (téléchargement / vérification)
    await prisma.publicationOccurrence.update({
      where: { id: occurrenceId },
      data: { status: "PREPARING" },
    });

    // Vérifier si l'utilisateur a annulé entre-temps
    const checkCancel = await prisma.publicationOccurrence.findUnique({
      where: { id: occurrenceId },
      select: { status: true },
    });
    if (checkCancel?.status === "CANCELLED") {
      return { status: "CANCELLED", message: "Annulation prise en compte pendant la préparation." };
    }

    // 2. Passage en PUBLISHING
    await prisma.publicationOccurrence.update({
      where: { id: occurrenceId },
      data: { status: "PUBLISHING" },
    });

    let allTargetsSucceeded = true;
    const results = [];

    for (const target of occurrence.targets) {
      // Mettre la cible en PROCESSING
      await prisma.publicationTarget.update({
        where: { id: target.id },
        data: { status: "PROCESSING" },
      });

      const connector = connectorRegistry.getConnector(target.channelConnection.provider);
      const mediaUrl =
        occurrence.variant.assets[0]?.rendition?.publicUrl ||
        occurrence.variant.assets[0]?.asset?.publicUrl ||
        undefined;

      const attemptStart = new Date();
      try {
        const publishResult = await connector.publish({
          targetId: target.id,
          externalAccountId: target.channelConnection.externalAccountId,
          format: occurrence.variant.format as SupportedFormat,
          caption: occurrence.variant.caption,
          mediaUrl,
          audioCatalogId: occurrence.variant.audioCatalogId ?? undefined,
          hasBioWatermark: occurrence.variant.hasBioWatermark,
        });

        // Enregistrer la tentative réussie
        await prisma.publishAttempt.create({
          data: {
            publicationTargetId: target.id,
            status: "SUCCESS",
            rawResponse: publishResult.rawResponse ? JSON.parse(JSON.stringify(publishResult.rawResponse)) : undefined,
            startedAt: attemptStart,
            finishedAt: new Date(),
          },
        });

        // Enregistrer le RemotePost
        await prisma.remotePost.create({
          data: {
            publicationTargetId: target.id,
            remotePostId: publishResult.remotePostId,
            permalinkUrl: publishResult.permalinkUrl,
            publishedAt: new Date(),
          },
        });

        // Marquer la cible en SUCCESS
        await prisma.publicationTarget.update({
          where: { id: target.id },
          data: { status: "SUCCESS" },
        });

        results.push({ targetId: target.id, success: true, url: publishResult.permalinkUrl });
      } catch (error: unknown) {
        allTargetsSucceeded = false;
        const errMessage = error instanceof Error ? error.message : String(error);

        await prisma.publishAttempt.create({
          data: {
            publicationTargetId: target.id,
            status: "FAILED",
            errorMessage: errMessage,
            startedAt: attemptStart,
            finishedAt: new Date(),
          },
        });

        await prisma.publicationTarget.update({
          where: { id: target.id },
          data: { status: "FAILED" },
        });

        results.push({ targetId: target.id, success: false, error: errMessage });
      }
    }

    // 3. Clôture de l'occurrence
    const finalStatus = allTargetsSucceeded ? "PUBLISHED" : "FAILED";
    const finished = await prisma.publicationOccurrence.update({
      where: { id: occurrenceId },
      data: { status: finalStatus },
      include: {
        targets: {
          include: {
            remotePost: true,
          },
        },
      },
    });

    return {
      status: finalStatus,
      occurrence: finished,
      results,
    };
  }
}

export const publisherService = new PublisherService();
