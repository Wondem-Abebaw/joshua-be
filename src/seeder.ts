interface Role {
  name: string;
  key: string;
  protected?: boolean;
}
interface Permission {
  name: string;
  key: string;
}
export const Roles: Role[] = [
  {
    name: 'Super Admin',
    key: 'super_admin',
    protected: true,
  },
  {
    name: 'Admin',
    key: 'admin',
  },
  {
    name: 'Finance',
    key: 'finance',
  },
  {
    name: 'CRM and Operator',
    key: 'operator',
  },
  {
    name: 'Employee',
    key: 'employee',
    protected: true,
  },
  {
    name: 'Employer',
    key: 'employer',
    protected: true,
  },
  {
    name: 'School',
    key: 'school',
    protected: true,
  },
  {
    name: 'Parent',
    key: 'parent',
    protected: true,
  },
];
export const Permissions: Permission[] = [
  {
    name: 'Manage Roles',
    key: 'manage-roles',
  },
  {
    name: 'Manage Permissions',
    key: 'manage-permissions',
  },
  {
    name: 'Manage Account Roles',
    key: 'manage-account-roles',
  },
  {
    name: 'Manage Account Permissions',
    key: 'manage-account-permissions',
  },
  {
    name: 'Import Internal Users',
    key: 'import-users',
  },
  {
    name: 'Manage Users',
    key: 'manage-users',
  },
  {
    name: 'Activate or Block Users',
    key: 'activate-or-block-users',
  },
  {
    name: 'Manage Employees',
    key: 'manage-employees',
  },
  {
    name: 'Activate or Block Employees',
    key: 'activate-or-block-employees',
  },
  {
    name: 'Manage Notifications',
    key: 'manage-notifications',
  },
  {
    name: 'Manage Services',
    key: 'manage-service',
  },
  {
    name: 'Manage News',
    key: 'manage-news',
  },
  {
    name: 'Manage Faqs',
    key: 'manage-faqs',
  },
  {
    name: 'Manage Feedbacks',
    key: 'manage-feedbacks',
  },
  {
    name: 'Manage Reviews',
    key: 'manage-reviews',
  },
  {
    name: 'Manage Configurations',
    key: 'manage-configurations',
  },
  {
    name: 'Manage Adverts',
    key: 'manage-adverts',
  },
  {
    name: 'Activate or Block Advers',
    key: 'activate-or-block-adverts',
  },
  {
    name: 'Manage Advert Plans',
    key: 'manage-advert-plans',
  },
  {
    name: 'Activate or Block Advert Plans',
    key: 'activate-or-block-advert-plans',
  },
  {
    name: 'Manage Candidates',
    key: 'manage-candidates',
  },
  {
    name: 'Manage Payments',
    key: 'manage-payments',
  },
  {
    name: 'Manage Payment Plans',
    key: 'manage-payment-plans',
  },
  {
    name: 'Manage Requests',
    key: 'manage-requests',
  },
  {
    name: 'Manage Parents',
    key: 'manage-parents',
  },
  {
    name: 'Activate or Block Parents',
    key: 'activate-or-block-parents',
  },
  {
    name: 'Manage Schools',
    key: 'manage-schools',
  },
  {
    name: 'Activate and Block Schools',
    key: 'activate-or-block-schools',
  },
  {
    name: 'Manage Attendance',
    key: 'manage-attendance',
  },
  {
    name: 'Manage Chats',
    key: 'manage-chats',
  },
];
