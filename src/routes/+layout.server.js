import { queryData } from "$lib/db.js";

export const load = ({ params }) => {
  const organizations = queryData(`
    SELECT organization_name, organization_title, count(*) AS count
    FROM datasets
    GROUP BY organization_name
    ORDER BY count DESC
    LIMIT 10
  `);
  const publishers = queryData(`
    SELECT publisher, count(*) AS count
    FROM datasets
    WHERE publisher IS NOT NULL
    GROUP BY publisher
    ORDER BY count DESC
    LIMIT 10
  `);
  const bureaus = queryData(`
    SELECT bureau_code, bureau_name, count(*) AS count
    FROM datasets
    WHERE bureau_code IS NOT NULL
    GROUP BY bureau_code
    ORDER BY count DESC
    LIMIT 10
  `);
  const tags = queryData(`
    SELECT tag, count(*) AS count
    FROM tags
    GROUP BY tag
    ORDER BY count DESC
    LIMIT 20
  `);

  return { organizations, publishers, bureaus, tags };
};
