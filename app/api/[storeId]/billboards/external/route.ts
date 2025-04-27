import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string; billboardId?: string } }
) {
  try {
    const body = await req.json();
    const { userId, label, imageUrl } = body;

    console.log("this is my UserID in external POST", userId);
    console.log("this is my image url in external POST", imageUrl);

    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

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

    // Create billboard
    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARDS_EXTERNAL_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
