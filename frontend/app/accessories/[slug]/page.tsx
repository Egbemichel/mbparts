import React from "react";
import AccessoriesClient from "@/app/accessories/[slug]/AccessoriesClient";

interface AccessoriesPageProps {
    params: Promise<{ slug: string }>;
}

export default async function Page({params}: AccessoriesPageProps) {
    const {slug} = await params;
    return <AccessoriesClient categorySlug={slug}/>;
}
