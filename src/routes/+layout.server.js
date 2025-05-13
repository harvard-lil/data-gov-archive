import { queryData } from "$lib/db.js";

export const load = async ({ params }) => {
  const topN = 10;
  const organizations = await queryData(`
    SELECT organization_name, organization_title, count(*) AS count
    FROM datasets
    GROUP BY organization_name
    ORDER BY count DESC
    LIMIT ${topN}
  `);
  const publishers = await queryData(`
    SELECT publisher, count(*) AS count
    FROM datasets
    WHERE publisher IS NOT NULL
    GROUP BY publisher
    ORDER BY count DESC
    LIMIT ${topN}
  `);
  const bureaus = await queryData(`
    SELECT bureau_code, bureau_name, count(*) AS count
    FROM datasets
    WHERE bureau_code IS NOT NULL
    GROUP BY bureau_code
    ORDER BY count DESC
    LIMIT ${topN}
  `);
  const tags = await queryData(`
    SELECT tag, count(*) AS count
    FROM tags
    GROUP BY tag
    ORDER BY count DESC
    LIMIT 20
  `);

  return { organizations, publishers, bureaus, tags };
};
