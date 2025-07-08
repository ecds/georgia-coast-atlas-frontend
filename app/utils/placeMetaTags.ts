import type { ESPlace, ESRelatedPlace } from "~/esTypes";

const imageSize = 300;

const identifiers = (place: ESPlace | ESRelatedPlace) => {
  if (!place.identifiers) return;
  return place.identifiers.map((i) => i.identifier);
};

const metaImage = (place: ESPlace) => {
  if (place.featured_photograph) {
    return place.featured_photograph.replace(
      /full.*/,
      "square/300,/0/default.jpg"
    );
  }

  return `https://iiif-cloud.ecdsdev.org/iiif/3/34w79u480oxw5gll3iddpa4yfkvg;1/square/${imageSize},/0/default.jpg`;
};

const associatedMedia = (place: ESPlace) => {
  const media = [];
  if (place.photographs) {
    for (const photo of place.photographs) {
      media.push({
        "@type": "ImageObject",
        contentUrl: photo.full_url,
        name: photo.name,
      });
    }
  }

  if (place.videos) {
    for (const video of place.videos) {
      media.push({
        "@type": "VideoObject",
        name: video.name,
        embedUrl: video.embed_url,
        thumbnail: video.thumbnail_url,
      });
    }
  }

  return media;
};

const mentions = (place: ESPlace) => {
  let relatedPlaces = place.places;
  if (place.other_places?.length === 0) {
    relatedPlaces = [...relatedPlaces, ...place.other_places];
  }
  if (relatedPlaces) {
    return relatedPlaces.map((relatedPlace) => {
      return {
        "@type": "Place",
        name: relatedPlace.name,
        geo: {
          "@type": "GeoCoordinates",
          latitude: relatedPlace.location.lat,
          longitude: relatedPlace.location.lon,
        },
        sameAs: identifiers(relatedPlace),
      };
    });
  }
};

export const placeMetaDefaults = [
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

export const placeMetaTags = (place: ESPlace | undefined = undefined) => {
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
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "ItemPage",
          identifier: place.identifier,
          name: place.name,
          alternateName: place.names?.filter((name) => name !== place.name),
          url: `https://georgiacoastatlas.org/places/${place.slug}`,
          headline: `Georgia Coast Atlas: ${place.name}`,
          abstract:
            place.short_description ??
            `Short article about ${place.name}, Georgia.`,
          inLanguage: "en-US",
          thumbnailUrl: metaImage(place),
          isPartOf: "https://georgiacoastatlas.org",
          primaryImageOfPage: {
            "@type": "ImageObject",
            contentUrl: place.featured_photograph,
          },
          about: {
            "@type": "Place",
            name: place.name,
            sameAs: identifiers,
            geo: {
              "@type": "GeoCoordinates",
              latitude: place.location.lat,
              longitude: place.location.lon,
            },
          },
          contentLocation: {
            "@type": "Place",
            name: place.name,
            sameAs: identifiers(place),
            geo: {
              "@type": "GeoCoordinates",
              latitude: place.location.lat,
              longitude: place.location.lon,
            },
          },
          author: {
            "@type": "Organization",
            name: "Emory Center for Digital Scholarship",
            url: "https://ecds.emory.edu",
          },
          publisher: {
            "@type": "Organization",
            name: "Emory Center for Digital Scholarship",
            logo: {
              "@type": "ImageObject",
              url: "https://georgiacoastatlas/images/ecds-logo.jpg",
            },
            url: "https://ecds.emory.edu",
          },
          associatedMedia: associatedMedia(place),
          mentions: mentions(place),
        },
      },
    ];
  }

  return placeMetaDefaults;
};
