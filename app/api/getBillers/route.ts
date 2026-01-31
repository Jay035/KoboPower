import { getMonnifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

interface BillerCategory {
  id: string;
  name: string;
}

export async function GET() {
  try {
    const token = await getMonnifyToken();

    const categoryRes = await fetch(
      "https://sandbox.monnify.com/api/v1/vas/bills-payment/biller-categories",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    const categoryData = await categoryRes.json();
    console.log(categoryData);

    if (!categoryRes.ok) {
      return NextResponse.json(
        { message: categoryData.responseMessage },
        { status: 400 },
      );
    }

    const electricityCategory = categoryData.responseBody.content.find(
      (cat: BillerCategory) => cat.name.toLowerCase() === "electricity",
    );
    console.log(electricityCategory);

    if (!electricityCategory) {
      return NextResponse.json(
        { message: "Electricity category not found" },
        { status: 404 },
      );
    }

    const billersRes = await fetch(
      `https://sandbox.monnify.com/api/v1/vas/bills-payment/billers?categoryId=${electricityCategory.code}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    const billersData = await billersRes.json();
    console.log(billersData);

    if (!billersRes.ok) {
      return NextResponse.json(
        { message: billersData.responseMessage },
        { status: 400 },
      );
    }

    return NextResponse.json({
      category: electricityCategory,
      billers: billersData.responseBody.content,
    });

    // return NextResponse.json({
    //   category: electricityCategory,
    //   billers: billersData.responseBody,
    // });
  } catch (error: unknown) {
    let message = "An unexpected error occurred";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ message }, { status: 500 });
  }
}
