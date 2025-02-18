import type { ESPlace } from "~/esTypes";

const imageSize = 300;

const metaImage = (place: ESPlace) => {
  if (place.featured_photograph) {
    return place.featured_photograph.replace(
      /full.*/,
      "square/300,/0/default.jpg"
    );
  }

  return `https://iiif-cloud.ecdsdev.org/iiif/3/34w79u480oxw5gll3iddpa4yfkvg;1/square/${imageSize},/0/default.jpg`;
};

const defaults = [
  {
    title: "Georgia Coast Atlas",
  },
  {
    property: "og:title",
    content: "Georgia Coast Atlas",
  },
  {
    property: "description",
    content:
      "The Georgia coast, approximately 100 miles long, is defined by its barrier islands and their back-barrier environments. With a variety of life in maritime forests, salt marshes, tidal channels and creeks, back-dune meadows, coastal dunes, beaches, and offshore environments, the barrier islands and their back barrier environments are biologically rich. The seasonally subtropical climate of the islands, combined with large tidal fluxes, helps make Georgia salt marshes among the most biologically productive ecosystems in the world. The Georgia coast also holds nearly one-third of the salt marshes in the eastern U.S.",
  },
  {
    property: "og:description",
    content:
      "The Georgia coast, approximately 100 miles long, is defined by its barrier islands and their back-barrier environments. With a variety of life in maritime forests, salt marshes, tidal channels and creeks, back-dune meadows, coastal dunes, beaches, and offshore environments, the barrier islands and their back barrier environments are biologically rich. The seasonally subtropical climate of the islands, combined with large tidal fluxes, helps make Georgia salt marshes among the most biologically productive ecosystems in the world. The Georgia coast also holds nearly one-third of the salt marshes in the eastern U.S.",
  },
  {
    property: "og:image",
    content: `https://iiif-cloud.ecdsdev.org/iiif/3/34w79u480oxw5gll3iddpa4yfkvg;1/square/${imageSize},/0/default.jpg`,
  },
  {
    property: "og:image:width",
    content: imageSize,
  },
  {
    property: "og:image:height",
    content: imageSize,
  },
  {
    property: "og:image:alt",
    content:
      "Aerial view of Tybee Creek on the Georgia coast. The waterway branches into numerous smaller tributaries, creating an intricate network of waterways. The land is covered in earthy brown tones with sparse green vegetation, while the sky above is pale blue, fading into the horizon. The overall scene conveys a sense of natural beauty and tranquility.",
  },
];

export const pageMetadata = (place: ESPlace | undefined = undefined) => {
  if (place) {
    return [
      {
        title: `${place.name}: Georgia Coast Atlas`,
      },
      {
        property: "og:title",
        content: `${place.name}: Georgia Coast Atlas`,
      },
      {
        property: "description",
        content: place.short_description,
      },
      {
        property: "og:description",
        content: place.short_description,
      },
      {
        property: "og:image",
        content: metaImage(place),
      },
      {
        property: "og:image:width",
        content: imageSize,
      },
      {
        property: "og:image:height",
        content: imageSize,
      },
      // {
      //   "@context": "https://schema.org",
      //   "@type": "Article",
      //   name: place.name,
      //   url: `https://georgiacoastatlas.org/islands/${place.slug}`,
      //   sameAs: "http:\/\/www.wikidata.org\/entity\/Q515603",
      //   mainEntity: "http:\/\/www.wikidata.org\/entity\/Q515603",
      //   author: {
      //     "@type": "Organization",
      //     name: "Contributors to Wikimedia projects",
      //   },
      //   publisher: {
      //     "@type": "Organization",
      //     name: "Wikimedia Foundation, Inc.",
      //     logo: {
      //       "@type": "ImageObject",
      //       url: "https:\/\/www.wikimedia.org\/static\/images\/wmf-hor-googpub.png",
      //     },
      //   },
      //   datePublished: "2004-12-19T05:11:06Z",
      //   dateModified: "2024-12-31T20:29:34Z",
      //   image:
      //     "https:\/\/upload.wikimedia.org\/wikipedia\/commons\/0\/08\/RJ_Reynolds_mansion%2C_Sapelo_Island%2C_GA%2C_US.jpg",
      //   headline: "island in Georgia, United States of America",
      // }
    ];
  }

  return defaults;
};
