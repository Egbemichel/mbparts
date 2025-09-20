import React from "react";
import PartsClient from "./PartClient";

interface PartsPageProps {
    params: Promise<{ slug: string }>;
}

export default async function Page({params}: PartsPageProps) {
    const {slug} = await params;
    return <PartsClient categorySlug={slug}/>;
}
