import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@interfaces/lib/prisma";
import { verifyAccessToken } from "@interfaces/lib/auth/token";

async function getAuth(req: NextRequest): Promise<{ id: string } | null> {
    try {
        const sessionCookie = req.cookies.get("access-token")?.value;
        const authHeader = req.headers.get("authorization");
        const tokenStr = authHeader?.split(" ")[1] ?? sessionCookie;
        if (!tokenStr) return null;
        const payload = await verifyAccessToken(tokenStr) as { id: string } | null;
        return payload;
    } catch {
        return null;
    }
}

async function getUserCompanyId(userId: string): Promise<string | null> {
    const uc = await prisma.userCompany.findFirst({ where: { userId }, select: { companyId: true } });
    return uc?.companyId ?? null;
}

/**
 * GET /api/notifications?tab=principal|novedades|archivo
 */
export async function GET(req: NextRequest) {
    try {
        const payload = await getAuth(req);
        if (!payload?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

        const companyId = await getUserCompanyId(payload.id);
        if (!companyId) return NextResponse.json({ error: "Empresa no encontrada" }, { status: 404 });

        const tab = req.nextUrl.searchParams.get("tab") ?? "principal";

        let where: any = { userId: payload.id, companyId };

        if (tab === "archivo") {
            where.archived = true;
        } else if (tab === "novedades") {
            where.archived = false;
            where.read = false;
        } else {
            // principal = no archivadas
            where.archived = false;
        }

        const notifications = await prisma.notification.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: 100,
        });

        // Conteos para badges de tabs
        const [totalUnread, totalArchived] = await Promise.all([
            prisma.notification.count({ where: { userId: payload.id, companyId, archived: false, read: false } }),
            prisma.notification.count({ where: { userId: payload.id, companyId, archived: true } }),
        ]);

        return NextResponse.json({ notifications, counts: { unread: totalUnread, archived: totalArchived } });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}

/**
 * PATCH /api/notifications
 * Body: { notificationId?, markAllRead?, archiveId?, archiveAll? }
 */
export async function PATCH(req: NextRequest) {
    try {
        const payload = await getAuth(req);
        if (!payload?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

        const body = await req.json();
        const { notificationId, markAllRead, archiveId, archiveAll, unarchiveId } = body;

        if (markAllRead) {
            await prisma.notification.updateMany({
                where: { userId: payload.id, read: false },
                data: { read: true },
            });
            return NextResponse.json({ success: true });
        }

        if (archiveAll) {
            await prisma.notification.updateMany({
                where: { userId: payload.id, archived: false },
                data: { archived: true, read: true },
            });
            return NextResponse.json({ success: true });
        }

        if (archiveId) {
            await prisma.notification.updateMany({
                where: { id: archiveId, userId: payload.id },
                data: { archived: true, read: true },
            });
            return NextResponse.json({ success: true });
        }

        if (unarchiveId) {
            await prisma.notification.updateMany({
                where: { id: unarchiveId, userId: payload.id },
                data: { archived: false },
            });
            return NextResponse.json({ success: true });
        }

        if (notificationId) {
            await prisma.notification.updateMany({
                where: { id: notificationId, userId: payload.id },
                data: { read: true },
            });
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    } catch (error) {
        console.error("Error updating notifications:", error);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}

/**
 * DELETE /api/notifications
 * Body: { notificationId } | { deleteAll: true }
 */
export async function DELETE(req: NextRequest) {
    try {
        const payload = await getAuth(req);
        if (!payload?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

        const body = await req.json();
        const { notificationId, deleteAll } = body;

        if (deleteAll) {
            await prisma.notification.deleteMany({ where: { userId: payload.id } });
            return NextResponse.json({ success: true });
        }

        if (notificationId) {
            await prisma.notification.deleteMany({
                where: { id: notificationId, userId: payload.id },
            });
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    } catch (error) {
        console.error("Error deleting notifications:", error);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}
