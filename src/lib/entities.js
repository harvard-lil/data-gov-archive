export const entities = [
  {
    type: "organization",
    route: "organizations", // Keep for database queries
    identifier: "organization_title",
    label: "organization_title",
    title: "Organization",
    showOrganization: false,
  },
  {
    type: "bureau",
    route: "bureaus", // Keep for database queries
    identifier: "bureau_name",
    label: "bureau_name",
    title: "Bureau",
    showOrganization: true,
  },
  {
    type: "publisher",
    route: "publishers", // Keep for database queries
    identifier: "publisher",
    label: "publisher",
    title: "Publisher",
    showOrganization: true,
  },
  {
    type: "tag",
    route: "tags", // Keep for database queries
    identifier: "tag",
    label: "tag",
    title: "Tag",
    showOrganization: false,
  },
];
