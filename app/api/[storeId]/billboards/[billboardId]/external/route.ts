import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; billboardId?: string } }
) {
  try {
    if (params.billboardId) {
      // GET single billboard by ID
      const billboard = await prismadb.billboard.findUnique({
        where: {
          id: params.billboardId,
        },
      });
      return NextResponse.json(billboard);
    } else {
      // GET all billboards
      const billboards = await prismadb.billboard.findMany({
        where: {
          storeId: params.storeId,
        },
      });
      return NextResponse.json(billboards);
    }
  } catch (error) {
    console.log("[BILLBOARDS_EXTERNAL_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const body = await req.json();
    const { userId, label, imageUrl } = body;

    console.log("this is my UserID in external PATCH", userId);
    console.log("this is my image url in external PATCH", imageUrl);

    // Validate userId
    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    // Validate label
    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }

    // Validate imageUrl
    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
    }

    // Validate billboardId
    if (!params.billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }

    // Check store ownership
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized: User does not own this store", {
        status: 403,
      });
    }

    // Update billboard
    const billboard = await prismadb.billboard.update({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARDS_EXTERNAL_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const body = await req.json();
    const { userId } = body;

    console.log("this is my UserID in external DELETE", userId);

    // Validate userId
    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    // Validate billboardId
    if (!params.billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }

    // Check store ownership
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized: User does not own this store", {
        status: 403,
      });
    }

    // Delete billboard
    const billboard = await prismadb.billboard.delete({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARDS_EXTERNAL_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
