type CollectionMetaArgs = {
    title: string;
    description?: string;
    image: string;
    slug: string;
};

export const collectionMetadata = ({
    title,
    description,
    image,
    slug,
}: CollectionMetaArgs) => {
    const siteName = "Georgia Coast Atlas";
    const siteUrl = "https://georgiacoastatlas.org";

    const fallbackDescription = `Explore content from the ${title} of the Georgia Coast Atlas.`;

    return [
        { title: `${title} | ${siteName}` },
        {
            name: "description",
            content: description ?? fallbackDescription,
        },
        {
            property: "og:title",
            content: `${title} | ${siteName}`,
        },
        {
            property: "og:description",
            content: description ?? fallbackDescription,
        },
        { property: "og:image", content: image },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        {
            property: "og:url",
            content: `${siteUrl}/collections/${slug}`,
        },
        { name: "twitter:card", content: "summary_large_image" },
    ];
};
