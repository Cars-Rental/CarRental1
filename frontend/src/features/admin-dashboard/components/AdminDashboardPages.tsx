import Image from "next/image";
import type React from "react";
import {
  CalendarDays,
  Car,
  CheckCircle2,
  CreditCard,
  Eye,
  FileCheck2,
  Flag,
  FolderTree,
  Gift,
  MapPin,
  Megaphone,
  Pencil,
  Plus,
  Search,
  ShieldAlert,
  ShoppingCart,
  Store,
  Trash2,
  UserCheck,
  UserX,
  Users,
  XCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardPageHeader } from "@/features/trader-dashboard/components/DashboardPageHeader";
import { DashboardTable } from "@/features/trader-dashboard/components/DashboardTable";
import {
  adminBookings,
  adminCars,
  adminCategories,
  adminChartData,
  adminLocations,
  adminNotifications,
  adminOrders,
  adminPayments,
  adminPromotions,
  adminReports,
  adminReviews,
  adminSettings,
  adminStats,
  adminTraders,
  adminUsers,
  adminVerificationRequests,
  formatAdminCurrency,
  formatAdminDate,
  getAdminInitials,
} from "../utils";
import type {
  AdminBooking,
  AdminCar,
  AdminCategoryItem,
  AdminNotification,
  AdminOrder,
  AdminPromotion,
  AdminReport,
  AdminTrader,
  AdminUser,
  AdminVerificationRequest,
} from "../types";
import { AdminStatusBadge } from "./AdminStatusBadge";

type AdminTranslation = ReturnType<typeof useTranslations>;

const chartColors = ["bg-primary", "bg-emerald-500", "bg-sky-500"];

function ActionButton({
  label,
  icon,
  variant = "outline",
}: {
  label: string;
  icon: React.ReactNode;
  variant?: "outline" | "destructive" | "ghost";
}) {
  return (
    <Button size="sm" variant={variant} className="h-8">
      {icon}
      <span>{label}</span>
    </Button>
  );
}

function AdminActions({
  actions,
}: {
  actions: Array<{
    label: string;
    icon: React.ReactNode;
    variant?: "outline" | "destructive" | "ghost";
  }>;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {actions.map((action) => (
        <ActionButton
          key={action.label}
          label={action.label}
          icon={action.icon}
          variant={action.variant}
        />
      ))}
    </div>
  );
}

function SearchToolbar({ t }: { t: AdminTranslation }) {
  return (
    <Card className="mb-6">
      <CardContent className="grid gap-3 p-4 md:grid-cols-[1fr_180px_140px]">
        <div className="relative">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="ps-9" placeholder={t("filters.search")} />
        </div>
        <Input placeholder={t("filters.status")} />
        <Button variant="outline">{t("filters.apply")}</Button>
      </CardContent>
    </Card>
  );
}

function PaginationFooter({ t }: { t: AdminTranslation }) {
  return (
    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
      <span>{t("pagination.summary")}</span>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline">
          {t("pagination.previous")}
        </Button>
        <Button size="sm" variant="outline">
          {t("pagination.next")}
        </Button>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 p-5">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

function BarChart({
  title,
  description,
  valueKey,
  t,
}: {
  title: string;
  description: string;
  valueKey: "revenue" | "bookings" | "orders";
  t: AdminTranslation;
}) {
  const maxValue = Math.max(...adminChartData.map((point) => point[valueKey]));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-56 items-end gap-3">
          {adminChartData.map((point, index) => (
            <div key={point.labelKey} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-44 w-full items-end rounded-md bg-muted/70 p-1">
                <div
                  className={`w-full rounded-md ${chartColors[index % chartColors.length]}`}
                  style={{ height: `${Math.max((point[valueKey] / maxValue) * 100, 8)}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {t(`months.${point.labelKey}`)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AvatarCell({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
        {getAdminInitials(name)}
      </div>
      <span className="font-medium text-foreground">{name}</span>
    </div>
  );
}

function CarCell({ car }: { car: AdminCar }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-12 w-16 overflow-hidden rounded-md bg-muted">
        <Image src={car.image} alt={car.title} fill className="object-cover" sizes="64px" />
      </div>
      <div>
        <p className="font-medium text-foreground">{car.title}</p>
        <p className="text-xs text-muted-foreground">{car.location}</p>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 text-base font-semibold text-foreground">{children}</h2>;
}

export function AdminOverviewPage() {
  const t = useTranslations("AdminDashboard");

  return (
    <>
      <DashboardPageHeader
        title={t("pages.overview.title")}
        description={t("pages.overview.description")}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard title={t("stats.totalUsers")} value={adminStats.totalUsers.toLocaleString()} icon={<Users />} />
        <MetricCard title={t("stats.totalTraders")} value={adminStats.totalTraders.toLocaleString()} icon={<Store />} />
        <MetricCard title={t("stats.activeRentalCars")} value={adminStats.activeRentalCars.toLocaleString()} icon={<Car />} />
        <MetricCard title={t("stats.carsForSale")} value={adminStats.carsForSale.toLocaleString()} icon={<ShoppingCart />} />
        <MetricCard title={t("stats.totalBookings")} value={adminStats.totalBookings.toLocaleString()} icon={<CalendarDays />} />
        <MetricCard title={t("stats.totalOrders")} value={adminStats.totalOrders.toLocaleString()} icon={<CreditCard />} />
        <MetricCard title={t("stats.monthlyRevenue")} value={formatAdminCurrency(adminStats.monthlyRevenue)} icon={<CreditCard />} />
        <MetricCard title={t("stats.platformCommission")} value={formatAdminCurrency(adminStats.platformCommission)} icon={<ShieldAlert />} />
        <MetricCard title={t("stats.pendingVerifications")} value={adminStats.pendingVerifications.toLocaleString()} icon={<FileCheck2 />} />
        <MetricCard title={t("stats.openReports")} value={adminStats.openReports.toLocaleString()} icon={<Flag />} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <BarChart title={t("charts.revenue")} description={t("charts.revenueDescription")} valueKey="revenue" t={t} />
        <BarChart title={t("charts.bookings")} description={t("charts.bookingsDescription")} valueKey="bookings" t={t} />
        <BarChart title={t("charts.orders")} description={t("charts.ordersDescription")} valueKey="orders" t={t} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <OverviewUsers t={t} title={t("sections.latestUsers")} data={adminUsers.slice(0, 3)} />
        <OverviewTraders t={t} title={t("sections.latestTraders")} data={adminTraders.slice(0, 3)} />
        <OverviewBookings t={t} title={t("sections.latestBookings")} data={adminBookings.slice(0, 3)} />
        <OverviewOrders t={t} title={t("sections.latestOrders")} data={adminOrders.slice(0, 3)} />
        <OverviewReports t={t} title={t("sections.recentReports")} data={adminReports.slice(0, 3)} />
        <QuickActions t={t} />
      </div>
    </>
  );
}

function OverviewUsers({ t, title, data }: { t: AdminTranslation; title: string; data: AdminUser[] }) {
  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      <DashboardTable
        data={data}
        getRowKey={(item) => item.id}
        columns={[
          { key: "name", header: t("tables.name"), cell: (item) => <AvatarCell name={item.name} /> },
          { key: "status", header: t("tables.status"), cell: (item) => <AdminStatusBadge status={item.status} label={t(`status.${item.status}`)} /> },
        ]}
      />
    </div>
  );
}

function OverviewTraders({ t, title, data }: { t: AdminTranslation; title: string; data: AdminTrader[] }) {
  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      <DashboardTable
        data={data}
        getRowKey={(item) => item.id}
        columns={[
          { key: "business", header: t("tables.business"), cell: (item) => item.businessName },
          { key: "status", header: t("tables.status"), cell: (item) => <AdminStatusBadge status={item.verificationStatus} label={t(`status.${item.verificationStatus}`)} /> },
        ]}
      />
    </div>
  );
}

function OverviewBookings({ t, title, data }: { t: AdminTranslation; title: string; data: AdminBooking[] }) {
  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      <DashboardTable
        data={data}
        getRowKey={(item) => item.id}
        columns={[
          { key: "booking", header: t("tables.bookingId"), cell: (item) => item.id },
          { key: "customer", header: t("tables.customer"), cell: (item) => item.customerName },
          { key: "status", header: t("tables.status"), cell: (item) => <AdminStatusBadge status={item.status} label={t(`status.${item.status}`)} /> },
        ]}
      />
    </div>
  );
}

function OverviewOrders({ t, title, data }: { t: AdminTranslation; title: string; data: AdminOrder[] }) {
  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      <DashboardTable
        data={data}
        getRowKey={(item) => item.id}
        columns={[
          { key: "order", header: t("tables.orderId"), cell: (item) => item.id },
          { key: "customer", header: t("tables.customer"), cell: (item) => item.customerName },
          { key: "status", header: t("tables.status"), cell: (item) => <AdminStatusBadge status={item.orderStatus} label={t(`status.${item.orderStatus}`)} /> },
        ]}
      />
    </div>
  );
}

function OverviewReports({ t, title, data }: { t: AdminTranslation; title: string; data: AdminReport[] }) {
  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      <DashboardTable
        data={data}
        getRowKey={(item) => item.id}
        columns={[
          { key: "target", header: t("tables.target"), cell: (item) => item.targetName },
          { key: "reason", header: t("tables.reason"), cell: (item) => item.reason },
          { key: "status", header: t("tables.status"), cell: (item) => <AdminStatusBadge status={item.status} label={t(`status.${item.status}`)} /> },
        ]}
      />
    </div>
  );
}

function QuickActions({ t }: { t: AdminTranslation }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("sections.quickActions")}</CardTitle>
        <CardDescription>{t("sections.quickActionsDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <Button variant="outline"><UserCheck />{t("actions.approve")}</Button>
        <Button variant="outline"><Megaphone />{t("actions.broadcast")}</Button>
        <Button variant="outline"><Gift />{t("actions.createPromotion")}</Button>
        <Button variant="outline"><Flag />{t("actions.reviewReports")}</Button>
      </CardContent>
    </Card>
  );
}

export function AdminUsersPage() {
  const t = useTranslations("AdminDashboard");
  return (
    <>
      <DashboardPageHeader title={t("pages.users.title")} description={t("pages.users.description")} />
      <SearchToolbar t={t} />
      <DashboardTable
        data={adminUsers}
        getRowKey={(item) => item.id}
        columns={[
          { key: "avatar", header: t("tables.avatar"), cell: (item) => <AvatarCell name={item.name} /> },
          { key: "email", header: t("tables.email"), cell: (item) => item.email },
          { key: "phone", header: t("tables.phone"), cell: (item) => item.phone },
          { key: "status", header: t("tables.status"), cell: (item) => <AdminStatusBadge status={item.status} label={t(`status.${item.status}`)} /> },
          { key: "created", header: t("tables.createdAt"), cell: (item) => formatAdminDate(item.createdAt) },
          { key: "bookings", header: t("tables.totalBookings"), cell: (item) => item.totalBookings },
          { key: "orders", header: t("tables.totalOrders"), cell: (item) => item.totalOrders },
          { key: "actions", header: t("tables.actions"), cell: () => <AdminActions actions={[
            { label: t("actions.view"), icon: <Eye /> },
            { label: t("actions.suspend"), icon: <UserX /> },
            { label: t("actions.activate"), icon: <UserCheck /> },
            { label: t("actions.delete"), icon: <Trash2 />, variant: "destructive" },
          ]} /> },
        ]}
      />
      <PaginationFooter t={t} />
    </>
  );
}

export function AdminTradersPage() {
  const t = useTranslations("AdminDashboard");
  return (
    <>
      <DashboardPageHeader title={t("pages.traders.title")} description={t("pages.traders.description")} />
      <SearchToolbar t={t} />
      <DashboardTable
        data={adminTraders}
        getRowKey={(item) => item.id}
        columns={[
          { key: "business", header: t("tables.business"), cell: (item) => item.businessName },
          { key: "owner", header: t("tables.owner"), cell: (item) => item.ownerName },
          { key: "email", header: t("tables.email"), cell: (item) => item.email },
          { key: "phone", header: t("tables.phone"), cell: (item) => item.phone },
          { key: "verification", header: t("tables.verification"), cell: (item) => <AdminStatusBadge status={item.verificationStatus} label={t(`status.${item.verificationStatus}`)} /> },
          { key: "cars", header: t("tables.carsCount"), cell: (item) => item.carsCount },
          { key: "earnings", header: t("tables.earnings"), cell: (item) => formatAdminCurrency(item.earnings) },
          { key: "joined", header: t("tables.joinedAt"), cell: (item) => formatAdminDate(item.joinedAt) },
          { key: "actions", header: t("tables.actions"), cell: () => <AdminActions actions={[
            { label: t("actions.approve"), icon: <CheckCircle2 /> },
            { label: t("actions.reject"), icon: <XCircle /> },
            { label: t("actions.suspend"), icon: <UserX /> },
            { label: t("actions.viewProfile"), icon: <Eye /> },
          ]} /> },
        ]}
      />
    </>
  );
}

export function AdminCarsPage({ type }: { type: "rent" | "sale" }) {
  const t = useTranslations("AdminDashboard");
  const cars = adminCars.filter((car) => car.type === type);
  const pageKey = type === "rent" ? "rentalCars" : "saleCars";
  return (
    <>
      <DashboardPageHeader title={t(`pages.${pageKey}.title`)} description={t(`pages.${pageKey}.description`)} />
      <SearchToolbar t={t} />
      <DashboardTable
        data={cars}
        getRowKey={(item) => item.id}
        columns={[
          { key: "car", header: t("tables.car"), cell: (item) => <CarCell car={item} /> },
          { key: "trader", header: t("tables.trader"), cell: (item) => item.traderName },
          { key: "category", header: t("tables.category"), cell: (item) => item.category },
          { key: "price", header: t("tables.price"), cell: (item) => formatAdminCurrency(item.price) },
          { key: "status", header: t("tables.status"), cell: (item) => <AdminStatusBadge status={item.status} label={t(`status.${item.status}`)} /> },
          { key: "actions", header: t("tables.actions"), cell: () => <AdminActions actions={[
            { label: t("actions.view"), icon: <Eye /> },
            { label: t("actions.edit"), icon: <Pencil /> },
            { label: t("actions.suspend"), icon: <ShieldAlert /> },
            { label: t("actions.delete"), icon: <Trash2 />, variant: "destructive" },
          ]} /> },
        ]}
      />
    </>
  );
}

export function AdminBookingsPage() {
  const t = useTranslations("AdminDashboard");
  return (
    <>
      <DashboardPageHeader title={t("pages.bookings.title")} description={t("pages.bookings.description")} />
      <SearchToolbar t={t} />
      <DashboardTable
        data={adminBookings}
        getRowKey={(item) => item.id}
        columns={[
          { key: "id", header: t("tables.bookingId"), cell: (item) => item.id },
          { key: "customer", header: t("tables.customer"), cell: (item) => item.customerName },
          { key: "trader", header: t("tables.trader"), cell: (item) => item.traderName },
          { key: "car", header: t("tables.car"), cell: (item) => item.carTitle },
          { key: "pickup", header: t("tables.pickup"), cell: (item) => formatAdminDate(item.pickupDate) },
          { key: "return", header: t("tables.return"), cell: (item) => formatAdminDate(item.returnDate) },
          { key: "price", header: t("tables.price"), cell: (item) => formatAdminCurrency(item.price) },
          { key: "status", header: t("tables.status"), cell: (item) => <AdminStatusBadge status={item.status} label={t(`status.${item.status}`)} /> },
          { key: "actions", header: t("tables.actions"), cell: () => <AdminActions actions={[{ label: t("actions.view"), icon: <Eye /> }, { label: t("actions.cancel"), icon: <XCircle />, variant: "destructive" }]} /> },
        ]}
      />
    </>
  );
}

export function AdminOrdersPage() {
  const t = useTranslations("AdminDashboard");
  return (
    <>
      <DashboardPageHeader title={t("pages.orders.title")} description={t("pages.orders.description")} />
      <SearchToolbar t={t} />
      <DashboardTable
        data={adminOrders}
        getRowKey={(item) => item.id}
        columns={[
          { key: "id", header: t("tables.orderId"), cell: (item) => item.id },
          { key: "customer", header: t("tables.customer"), cell: (item) => item.customerName },
          { key: "trader", header: t("tables.trader"), cell: (item) => item.traderName },
          { key: "car", header: t("tables.car"), cell: (item) => item.carTitle },
          { key: "price", header: t("tables.price"), cell: (item) => formatAdminCurrency(item.price) },
          { key: "payment", header: t("tables.paymentStatus"), cell: (item) => <AdminStatusBadge status={item.paymentStatus} label={t(`status.${item.paymentStatus}`)} /> },
          { key: "status", header: t("tables.orderStatus"), cell: (item) => <AdminStatusBadge status={item.orderStatus} label={t(`status.${item.orderStatus}`)} /> },
          { key: "actions", header: t("tables.actions"), cell: () => <AdminActions actions={[{ label: t("actions.view"), icon: <Eye /> }, { label: t("actions.cancel"), icon: <XCircle />, variant: "destructive" }]} /> },
        ]}
      />
    </>
  );
}

export function AdminReviewsPage() {
  const t = useTranslations("AdminDashboard");
  return (
    <>
      <DashboardPageHeader title={t("pages.reviews.title")} description={t("pages.reviews.description")} />
      <DashboardTable
        data={adminReviews}
        getRowKey={(item) => item.id}
        columns={[
          { key: "customer", header: t("tables.customer"), cell: (item) => item.customerName },
          { key: "car", header: t("tables.car"), cell: (item) => item.carTitle },
          { key: "rating", header: t("tables.rating"), cell: (item) => `${item.rating}/5` },
          { key: "review", header: t("tables.review"), cell: (item) => item.review },
          { key: "date", header: t("tables.date"), cell: (item) => formatAdminDate(item.date) },
          { key: "actions", header: t("tables.actions"), cell: () => <AdminActions actions={[{ label: t("actions.hide"), icon: <Eye /> }, { label: t("actions.delete"), icon: <Trash2 />, variant: "destructive" }]} /> },
        ]}
      />
    </>
  );
}

export function AdminReportsPage() {
  const t = useTranslations("AdminDashboard");
  return (
    <>
      <DashboardPageHeader title={t("pages.reports.title")} description={t("pages.reports.description")} />
      <SearchToolbar t={t} />
      <DashboardTable
        data={adminReports}
        getRowKey={(item) => item.id}
        columns={[
          { key: "reporter", header: t("tables.reporter"), cell: (item) => item.reporterName },
          { key: "target", header: t("tables.target"), cell: (item) => `${t(`targetType.${item.targetType}`)}: ${item.targetName}` },
          { key: "reason", header: t("tables.reason"), cell: (item) => item.reason },
          { key: "date", header: t("tables.date"), cell: (item) => formatAdminDate(item.date) },
          { key: "status", header: t("tables.status"), cell: (item) => <AdminStatusBadge status={item.status} label={t(`status.${item.status}`)} /> },
          { key: "actions", header: t("tables.actions"), cell: () => <AdminActions actions={[
            { label: t("actions.resolve"), icon: <CheckCircle2 /> },
            { label: t("actions.dismiss"), icon: <XCircle /> },
            { label: t("actions.deleteContent"), icon: <Trash2 />, variant: "destructive" },
          ]} /> },
        ]}
      />
    </>
  );
}

export function AdminPaymentsPage() {
  const t = useTranslations("AdminDashboard");
  return (
    <>
      <DashboardPageHeader title={t("pages.payments.title")} description={t("pages.payments.description")} />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title={t("payments.totalRevenue")} value={formatAdminCurrency(adminPayments.totalRevenue)} icon={<CreditCard />} />
        <MetricCard title={t("payments.platformCommission")} value={formatAdminCurrency(adminPayments.platformCommission)} icon={<ShieldAlert />} />
        <MetricCard title={t("payments.pendingWithdrawals")} value={formatAdminCurrency(adminPayments.pendingWithdrawals)} icon={<CalendarDays />} />
        <MetricCard title={t("payments.completedWithdrawals")} value={formatAdminCurrency(adminPayments.completedWithdrawals)} icon={<CheckCircle2 />} />
      </div>
      <DashboardTable
        data={adminPayments.transactions}
        getRowKey={(item) => item.id}
        columns={[
          { key: "id", header: t("tables.transactionId"), cell: (item) => item.id },
          { key: "trader", header: t("tables.trader"), cell: (item) => item.traderName },
          { key: "type", header: t("tables.type"), cell: (item) => t(`transactionType.${item.type}`) },
          { key: "amount", header: t("tables.amount"), cell: (item) => formatAdminCurrency(item.amount) },
          { key: "status", header: t("tables.status"), cell: (item) => <AdminStatusBadge status={item.status} label={t(`status.${item.status}`)} /> },
          { key: "date", header: t("tables.date"), cell: (item) => formatAdminDate(item.date) },
        ]}
      />
    </>
  );
}

export function AdminVerificationsPage() {
  const t = useTranslations("AdminDashboard");
  return (
    <>
      <DashboardPageHeader title={t("pages.verifications.title")} description={t("pages.verifications.description")} />
      <DashboardTable
        data={adminVerificationRequests}
        getRowKey={(item) => item.id}
        columns={[
          { key: "business", header: t("tables.business"), cell: (item) => item.businessName },
          { key: "trader", header: t("tables.trader"), cell: (item) => item.traderName },
          { key: "submitted", header: t("tables.submittedAt"), cell: (item) => formatAdminDate(item.submittedAt) },
          { key: "documents", header: t("tables.documents"), cell: (item: AdminVerificationRequest) => Object.values(item.documents).join(", ") },
          { key: "status", header: t("tables.status"), cell: (item) => <AdminStatusBadge status={item.status} label={t(`status.${item.status}`)} /> },
          { key: "actions", header: t("tables.actions"), cell: () => <AdminActions actions={[
            { label: t("actions.approve"), icon: <CheckCircle2 /> },
            { label: t("actions.reject"), icon: <XCircle /> },
            { label: t("actions.viewDocuments"), icon: <FileCheck2 /> },
          ]} /> },
        ]}
      />
    </>
  );
}

export function AdminNotificationsPage() {
  const t = useTranslations("AdminDashboard");
  return (
    <>
      <DashboardPageHeader
        title={t("pages.notifications.title")}
        description={t("pages.notifications.description")}
        action={<NotificationDialog t={t} />}
      />
      <SectionTitle>{t("sections.notificationHistory")}</SectionTitle>
      <DashboardTable
        data={adminNotifications}
        getRowKey={(item) => item.id}
        columns={[
          { key: "title", header: t("tables.title"), cell: (item: AdminNotification) => item.title },
          { key: "message", header: t("tables.message"), cell: (item) => item.message },
          { key: "audience", header: t("tables.audience"), cell: (item) => t(`audience.${item.audience}`) },
          { key: "date", header: t("tables.createdAt"), cell: (item) => formatAdminDate(item.createdAt) },
          { key: "status", header: t("tables.status"), cell: (item) => <AdminStatusBadge status={item.status} label={t(`status.${item.status}`)} /> },
        ]}
      />
    </>
  );
}

function NotificationDialog({ t }: { t: AdminTranslation }) {
  return (
    <Dialog>
      <DialogTrigger render={<Button />}>
        <Plus />
        {t("actions.createNotification")}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("notifications.createTitle")}</DialogTitle>
          <DialogDescription>{t("notifications.createDescription")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <Label htmlFor="notification-title">{t("tables.title")}</Label>
          <Input id="notification-title" placeholder={t("notifications.titlePlaceholder")} />
          <Label htmlFor="notification-message">{t("tables.message")}</Label>
          <Input id="notification-message" placeholder={t("notifications.messagePlaceholder")} />
        </div>
        <DialogFooter>
          <Button><Megaphone />{t("actions.broadcast")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AdminDictionaryPage({ mode }: { mode: "categories" | "locations" }) {
  const t = useTranslations("AdminDashboard");
  const data = mode === "categories" ? adminCategories : adminLocations;
  return (
    <>
      <DashboardPageHeader
        title={t(`pages.${mode}.title`)}
        description={t(`pages.${mode}.description`)}
        action={<Button><Plus />{t("actions.addItem")}</Button>}
      />
      <DictionaryCards t={t} data={data} />
    </>
  );
}

function DictionaryCards({ t, data }: { t: AdminTranslation; data: AdminCategoryItem[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {data.map((item) => (
        <Card key={item.id}>
          <CardContent className="flex items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                {item.type === "city" || item.type === "country" ? <MapPin /> : <FolderTree />}
              </div>
              <div>
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{t(`dictionaryType.${item.type}`)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AdminStatusBadge status={item.status} label={t(`status.${item.status}`)} />
              <Button size="icon-sm" variant="ghost"><Pencil /></Button>
              <Button size="icon-sm" variant="destructive"><Trash2 /></Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function AdminPromotionsPage() {
  const t = useTranslations("AdminDashboard");
  return (
    <>
      <DashboardPageHeader
        title={t("pages.promotions.title")}
        description={t("pages.promotions.description")}
        action={<Button><Plus />{t("actions.createPromotion")}</Button>}
      />
      <DashboardTable
        data={adminPromotions}
        getRowKey={(item) => item.id}
        columns={[
          { key: "name", header: t("tables.name"), cell: (item: AdminPromotion) => item.name },
          { key: "type", header: t("tables.type"), cell: (item) => t(`promotionType.${item.type}`) },
          { key: "value", header: t("tables.value"), cell: (item) => item.value },
          { key: "ends", header: t("tables.endsAt"), cell: (item) => formatAdminDate(item.endsAt) },
          { key: "status", header: t("tables.status"), cell: (item) => <AdminStatusBadge status={item.status} label={t(`status.${item.status}`)} /> },
          { key: "actions", header: t("tables.actions"), cell: () => <AdminActions actions={[{ label: t("actions.edit"), icon: <Pencil /> }, { label: t("actions.delete"), icon: <Trash2 />, variant: "destructive" }]} /> },
        ]}
      />
    </>
  );
}

export function AdminSettingsPage() {
  const t = useTranslations("AdminDashboard");
  const settings = [
    ["general", adminSettings.general],
    ["platform", adminSettings.platform],
    ["security", adminSettings.security],
    ["email", adminSettings.email],
    ["notifications", adminSettings.notifications],
    ["payments", adminSettings.payments],
    ["commission", adminSettings.commission],
    ["localization", adminSettings.localization],
  ] as const;

  return (
    <>
      <DashboardPageHeader title={t("pages.settings.title")} description={t("pages.settings.description")} />
      <div className="grid gap-4 md:grid-cols-2">
        {settings.map(([key, value]) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle>{t(`settings.${key}`)}</CardTitle>
              <CardDescription>{t(`settingsDescriptions.${key}`)}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-foreground">{value}</span>
              <Button size="sm" variant="outline"><Pencil />{t("actions.edit")}</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
