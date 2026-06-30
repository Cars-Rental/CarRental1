"use client";

import Image from "next/image";
import { useState } from "react";
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
  adminCars,
  adminCategories,
  adminLocations,
  adminPayments,
  adminPromotions,
  adminReports,
  adminSettings,
  adminVerificationRequests,
  formatAdminCurrency,
  formatAdminDate,
  getAdminInitials,
} from "../utils";
import {
  useAdminOverview,
  useAdminUsers,
  useAdminTraders,
  useAdminCars,
  useAdminRentalCar,
  useAdminBookings,
  useAdminBooking,
  useAdminOrders,
  useAdminOrder,
  useAdminReviews,
  useDeleteAdminReview,
  useAdminNotifications,
  useCreateAdminNotification,
  useBanAdminUser,
  useBanAdminTrader,
  useDeleteAdminUser,
  useDeleteAdminTrader,
  useDeleteAdminRentalCar,
  useUnbanAdminUser,
  useUnbanAdminTrader,
  useApproveAdminTrader,
  useSuspendAdminRentalCar,
  useCancelAdminBooking,
  useCancelAdminOrder,
} from "../hooks";
import type {
  AdminCar,
  AdminCarDetail,
  AdminCategoryItem,
  AdminBooking,
  AdminBookingDetail,
  AdminNotification,
  AdminOrder,
  AdminOrderDetail,
  AdminOverviewActivity,
  AdminOverviewPerson,
  AdminPromotion,
  AdminTrader,
  AdminUser,
  AdminVerificationRequest,
} from "../types";
import { AdminStatusBadge } from "./AdminStatusBadge";

type AdminTranslation = ReturnType<typeof useTranslations>;

function ActionButton({
  label,
  icon,
  variant = "outline",
  onClick,
  disabled,
}: {
  label: string;
  icon: React.ReactNode;
  variant?: "outline" | "destructive" | "ghost";
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant={variant}
      className="h-8"
      disabled={disabled}
      onClick={onClick}
    >
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
    onClick?: () => void;
    disabled?: boolean;
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
          disabled={action.disabled}
          onClick={action.onClick}
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

function PaginationFooter({
  t,
  page,
  totalPages,
  onPrevious,
  onNext,
}: {
  t: AdminTranslation;
  page?: number;
  totalPages?: number;
  onPrevious?: () => void;
  onNext?: () => void;
}) {
  return (
    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
      <span>
        {page && totalPages
          ? `${page} / ${totalPages}`
          : t("pagination.summary")}
      </span>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={!onPrevious || page === 1}
          onClick={onPrevious}
        >
          {t("pagination.previous")}
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={!onNext || !page || !totalPages || page >= totalPages}
          onClick={onNext}
        >
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
        {car.image ? (
          <Image src={car.image} alt={car.title} fill className="object-cover" sizes="64px" />
        ) : null}
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
  const { data: overview, isLoading } = useAdminOverview();
  const stats = overview?.stats;

  return (
    <>
      <DashboardPageHeader
        title={t("pages.overview.title")}
        description={t("pages.overview.description")}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title={t("stats.totalUsers")} value={isLoading ? "..." : (stats?.totalUsers ?? 0).toLocaleString()} icon={<Users />} />
        <MetricCard title={t("stats.totalTraders")} value={isLoading ? "..." : (stats?.totalTraders ?? 0).toLocaleString()} icon={<Store />} />
        <MetricCard title={t("stats.activeRentalCars")} value={isLoading ? "..." : (stats?.activeRentalCars ?? 0).toLocaleString()} icon={<Car />} />
        <MetricCard title={t("stats.carsForSale")} value={isLoading ? "..." : (stats?.carsForSale ?? 0).toLocaleString()} icon={<ShoppingCart />} />
        <MetricCard title={t("stats.totalBookings")} value={isLoading ? "..." : (stats?.totalBookings ?? 0).toLocaleString()} icon={<CalendarDays />} />
        <MetricCard title={t("stats.totalOrders")} value={isLoading ? "..." : (stats?.totalOrders ?? 0).toLocaleString()} icon={<CreditCard />} />
        <MetricCard title={t("stats.monthlyRevenue")} value={isLoading ? "..." : formatAdminCurrency(stats?.monthlyRevenue ?? 0)} icon={<CreditCard />} />
        <MetricCard title={t("stats.platformCommission")} value={isLoading ? "..." : formatAdminCurrency(stats?.platformCommission ?? 0)} icon={<ShieldAlert />} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <OverviewPeople t={t} title={t("sections.latestUsers")} data={overview?.recentUsers ?? []} isLoading={isLoading} />
        <OverviewPeople t={t} title={t("sections.latestTraders")} data={overview?.recentTraders ?? []} isLoading={isLoading} />
        <OverviewActivities t={t} title={t("sections.latestBookings")} data={overview?.recentBookings ?? []} idHeader={t("tables.bookingId")} isLoading={isLoading} />
        <OverviewActivities t={t} title={t("sections.latestOrders")} data={overview?.recentOrders ?? []} idHeader={t("tables.orderId")} isLoading={isLoading} />
        <QuickActions t={t} />
      </div>
    </>
  );
}

function OverviewPeople({
  t,
  title,
  data,
  isLoading,
}: {
  t: AdminTranslation;
  title: string;
  data: AdminOverviewPerson[];
  isLoading: boolean;
}) {
  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      <DashboardTable
        data={data}
        getRowKey={(item) => item.id}
        isLoading={isLoading}
        columns={[
          { key: "name", header: t("tables.name"), cell: (item) => <AvatarCell name={item.name} /> },
          { key: "status", header: t("tables.status"), cell: (item) => <AdminStatusBadge status={item.status} label={t(`status.${item.status}`)} /> },
        ]}
      />
    </div>
  );
}

function OverviewActivities({
  t,
  title,
  data,
  idHeader,
  isLoading,
}: {
  t: AdminTranslation;
  title: string;
  data: AdminOverviewActivity[];
  idHeader: string;
  isLoading: boolean;
}) {
  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      <DashboardTable
        data={data}
        getRowKey={(item) => item.id}
        isLoading={isLoading}
        columns={[
          { key: "id", header: idHeader, cell: (item) => item.id },
          { key: "customer", header: t("tables.customer"), cell: (item) => item.customerName },
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
  const { data, isLoading } = useAdminUsers();
  const users = data?.users ?? [];

  return (
    <>
      <DashboardPageHeader title={t("pages.users.title")} description={t("pages.users.description")} />
      <SearchToolbar t={t} />
      <DashboardTable
        data={users}
        getRowKey={(item) => item.id}
        isLoading={isLoading}
        columns={[
          { key: "avatar", header: t("tables.avatar"), cell: (item) => <AvatarCell name={item.name} /> },
          { key: "email", header: t("tables.email"), cell: (item) => item.email },
          { key: "phone", header: t("tables.phone"), cell: (item) => item.phone },
          { key: "status", header: t("tables.status"), cell: (item) => <AdminStatusBadge status={item.status} label={t(`status.${item.status}`)} /> },
          { key: "created", header: t("tables.createdAt"), cell: (item) => formatAdminDate(item.createdAt) },
          { key: "bookings", header: t("tables.totalBookings"), cell: (item) => item.totalBookings ?? "-" },
          { key: "orders", header: t("tables.totalOrders"), cell: (item) => item.totalOrders ?? "-" },
          { key: "actions", header: t("tables.actions"), cell: (item) => <AdminUserActions user={item} t={t} /> },
        ]}
      />
      <PaginationFooter t={t} />
    </>
  );
}

function AdminUserActions({
  user,
  t,
}: {
  user: AdminUser;
  t: AdminTranslation;
}) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const deleteUser = useDeleteAdminUser();
  const banUser = useBanAdminUser();
  const unbanUser = useUnbanAdminUser();
  const isMutating =
    deleteUser.isPending || banUser.isPending || unbanUser.isPending;

  function confirmDelete() {
    deleteUser.mutate(user.id, {
      onSuccess: () => setIsDeleteOpen(false),
    });
  }

  return (
    <>
      <AdminActions
        actions={[
          { label: t("actions.view"), icon: <Eye /> },
          user.status === "banned"
            ? {
                label: t("actions.activate"),
                icon: <UserCheck />,
                disabled: isMutating,
                onClick: () => unbanUser.mutate(user.id),
              }
            : {
                label: t("actions.suspend"),
                icon: <UserX />,
                disabled: isMutating,
                onClick: () => banUser.mutate(user.id),
              },
          {
            label: t("actions.delete"),
            icon: <Trash2 />,
            variant: "destructive",
            disabled: isMutating,
            onClick: () => setIsDeleteOpen(true),
          },
        ]}
      />

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("users.deleteTitle")}</DialogTitle>
            <DialogDescription>
              {t("users.deleteDescription", { name: user.name })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={deleteUser.isPending}
              onClick={() => setIsDeleteOpen(false)}
            >
              {t("actions.cancel")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteUser.isPending}
              onClick={confirmDelete}
            >
              {t("actions.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function AdminTradersPage() {
  const t = useTranslations("AdminDashboard");
  const { data, isLoading } = useAdminTraders();
  const traders = data?.traders ?? [];

  return (
    <>
      <DashboardPageHeader title={t("pages.traders.title")} description={t("pages.traders.description")} />
      <SearchToolbar t={t} />
      <DashboardTable
        data={traders}
        getRowKey={(item) => item.id}
        isLoading={isLoading}
        columns={[
          { key: "business", header: t("tables.business"), cell: (item) => item.businessName },
          { key: "owner", header: t("tables.owner"), cell: (item) => item.ownerName },
          { key: "email", header: t("tables.email"), cell: (item) => item.email },
          { key: "phone", header: t("tables.phone"), cell: (item) => item.phone },
          { key: "verification", header: t("tables.verification"), cell: (item) => {
            const status = item.status ?? item.verificationStatus ?? "active";
            return <AdminStatusBadge status={status} label={t(`status.${status}`)} />;
          } },
          { key: "cars", header: t("tables.carsCount"), cell: (item) => item.carsCount },
          { key: "earnings", header: t("tables.earnings"), cell: (item) => formatAdminCurrency(item.earnings) },
          { key: "joined", header: t("tables.joinedAt"), cell: (item) => formatAdminDate(item.joinedAt) },
          { key: "actions", header: t("tables.actions"), cell: (item) => <AdminTraderActions trader={item} t={t} /> },
        ]}
      />
    </>
  );
}

function AdminTraderActions({
  trader,
  t,
}: {
  trader: AdminTrader;
  t: AdminTranslation;
}) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const deleteTrader = useDeleteAdminTrader();
  const banTrader = useBanAdminTrader();
  const unbanTrader = useUnbanAdminTrader();
  const approveTrader = useApproveAdminTrader();
  const status = trader.status ?? trader.verificationStatus ?? "active";
  const isMutating =
    deleteTrader.isPending ||
    banTrader.isPending ||
    unbanTrader.isPending ||
    approveTrader.isPending;

  function confirmDelete() {
    deleteTrader.mutate(trader.id, {
      onSuccess: () => setIsDeleteOpen(false),
    });
  }

  return (
    <>
      <AdminActions
        actions={[
          {
            label: t("actions.approve"),
            icon: <CheckCircle2 />,
            disabled: isMutating,
            onClick: () => approveTrader.mutate(trader.id),
          },
          status === "banned"
            ? {
                label: t("actions.activate"),
                icon: <UserCheck />,
                disabled: isMutating,
                onClick: () => unbanTrader.mutate(trader.id),
              }
            : {
                label: t("actions.suspend"),
                icon: <UserX />,
                disabled: isMutating,
                onClick: () => banTrader.mutate(trader.id),
              },
          { label: t("actions.viewProfile"), icon: <Eye /> },
          {
            label: t("actions.delete"),
            icon: <Trash2 />,
            variant: "destructive",
            disabled: isMutating,
            onClick: () => setIsDeleteOpen(true),
          },
        ]}
      />

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("traders.deleteTitle")}</DialogTitle>
            <DialogDescription>
              {t("traders.deleteDescription", { name: trader.businessName })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={deleteTrader.isPending}
              onClick={() => setIsDeleteOpen(false)}
            >
              {t("actions.cancel")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteTrader.isPending}
              onClick={confirmDelete}
            >
              {t("actions.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function AdminCarsPage({ type }: { type: "rent" | "sale" }) {
  const t = useTranslations("AdminDashboard");
  const [page, setPage] = useState(1);
  const isRent = type === "rent";
  const { data: rentCarsData, isLoading } = useAdminCars("rent", {
    page,
    limit: 10,
  }, isRent);
  const cars = isRent
    ? rentCarsData?.cars ?? []
    : adminCars.filter((car) => car.type === type);
  const pagination = rentCarsData?.pagination;
  const pageKey = type === "rent" ? "rentalCars" : "saleCars";
  return (
    <>
      <DashboardPageHeader title={t(`pages.${pageKey}.title`)} description={t(`pages.${pageKey}.description`)} />
      <SearchToolbar t={t} />
      <DashboardTable
        data={cars}
        getRowKey={(item) => item.id}
        isLoading={isRent ? isLoading : false}
        columns={[
          { key: "car", header: t("tables.car"), cell: (item) => <CarCell car={item} /> },
          { key: "trader", header: t("tables.trader"), cell: (item) => item.traderName },
          { key: "category", header: t("tables.category"), cell: (item) => item.category },
          { key: "price", header: t("tables.price"), cell: (item) => formatAdminCurrency(item.price) },
          { key: "status", header: t("tables.status"), cell: (item) => {
            const status = normalizeAdminCarStatus(item.status);
            return <AdminStatusBadge status={status} label={t(`status.${status}`)} />;
          } },
          {
            key: "actions",
            header: t("tables.actions"),
            cell: (item) =>
              isRent ? (
                <AdminRentalCarActions car={item} t={t} />
              ) : (
                <AdminActions actions={[
                  { label: t("actions.view"), icon: <Eye /> },
                  { label: t("actions.edit"), icon: <Pencil /> },
                  { label: t("actions.suspend"), icon: <ShieldAlert /> },
                  { label: t("actions.delete"), icon: <Trash2 />, variant: "destructive" },
                ]} />
              ),
          },
        ]}
      />
      {isRent && (
        <PaginationFooter
          t={t}
          page={pagination?.page ?? page}
          totalPages={pagination?.totalPages ?? 1}
          onPrevious={() => setPage((current) => Math.max(1, current - 1))}
          onNext={() =>
            setPage((current) =>
              Math.min(pagination?.totalPages ?? current, current + 1)
            )
          }
        />
      )}
    </>
  );
}

function normalizeAdminCarStatus(status: string) {
  if (status === "avilable" || status === "available") return "active";
  if (status === "regestred" || status === "registered") return "suspended";
  return status;
}

function AdminRentalCarActions({
  car,
  t,
}: {
  car: AdminCar;
  t: AdminTranslation;
}) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const carDetails = useAdminRentalCar(isDetailsOpen ? car.id : null);
  const deleteCar = useDeleteAdminRentalCar();
  const suspendCar = useSuspendAdminRentalCar();
  const isMutating = deleteCar.isPending || suspendCar.isPending;

  function confirmDelete() {
    deleteCar.mutate(car.id, {
      onSuccess: () => setIsDeleteOpen(false),
    });
  }

  return (
    <>
      <AdminActions
        actions={[
          {
            label: t("actions.view"),
            icon: <Eye />,
            disabled: isMutating,
            onClick: () => setIsDetailsOpen(true),
          },
          {
            label: t("actions.suspend"),
            icon: <ShieldAlert />,
            disabled: isMutating,
            onClick: () => suspendCar.mutate(car.id),
          },
          {
            label: t("actions.delete"),
            icon: <Trash2 />,
            variant: "destructive",
            disabled: isMutating,
            onClick: () => setIsDeleteOpen(true),
          },
        ]}
      />

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("cars.detailsTitle")}</DialogTitle>
            <DialogDescription>{car.title}</DialogDescription>
          </DialogHeader>
          {carDetails.isLoading ? (
            <p className="text-sm text-muted-foreground">{t("cars.loadingDetails")}</p>
          ) : carDetails.data ? (
            <AdminRentalCarDetails car={carDetails.data} />
          ) : (
            <p className="text-sm text-muted-foreground">{t("cars.detailsEmpty")}</p>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("cars.deleteTitle")}</DialogTitle>
            <DialogDescription>
              {t("cars.deleteDescription", { name: car.title })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={deleteCar.isPending}
              onClick={() => setIsDeleteOpen(false)}
            >
              {t("actions.cancel")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteCar.isPending}
              onClick={confirmDelete}
            >
              {t("actions.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function AdminRentalCarDetails({ car }: { car: AdminCarDetail }) {
  const ownerName =
    typeof car.owner === "string" ? car.owner : car.owner.userName;

  const rows = [
    ["Brand", car.carbrand],
    ["Name", car.carname],
    ["Model", car.carmodel],
    ["Year", String(car.year)],
    ["Location", car.location],
    ["Owner", ownerName],
    ["Fuel", car.fuel],
    ["Transmission", car.Transmission],
    ["Seats", String(car.seatCount)],
    ["Body", car.Body_Type],
    ["Price", formatAdminCurrency(car.carprice)],
    ["Status", car.isavailable],
  ];

  return (
    <div className="grid gap-2 text-sm sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label} className="rounded-md border border-border p-3">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-1 font-medium text-foreground">{value}</p>
        </div>
      ))}
    </div>
  );
}

export function AdminBookingsPage() {
  const t = useTranslations("AdminDashboard");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminBookings({ page, limit: 10 });
  const bookings = data?.bookings ?? [];
  const pagination = data?.pagination;

  return (
    <>
      <DashboardPageHeader title={t("pages.bookings.title")} description={t("pages.bookings.description")} />
      <SearchToolbar t={t} />
      <DashboardTable
        data={bookings}
        getRowKey={(item) => item.id}
        isLoading={isLoading}
        columns={[
          { key: "id", header: t("tables.bookingId"), cell: (item) => item.idBk ?? item.id },
          { key: "customer", header: t("tables.customer"), cell: (item) => item.customerName },
          { key: "trader", header: t("tables.trader"), cell: (item) => item.traderName },
          { key: "car", header: t("tables.car"), cell: (item) => item.carTitle },
          { key: "pickup", header: t("tables.pickup"), cell: (item) => formatAdminDate(item.startDate ?? item.pickupDate ?? "") },
          { key: "return", header: t("tables.return"), cell: (item) => formatAdminDate(item.endDate ?? item.returnDate ?? "") },
          { key: "price", header: t("tables.price"), cell: (item) => formatAdminCurrency(item.totalPrice ?? item.price ?? 0) },
          { key: "status", header: t("tables.status"), cell: (item) => <AdminStatusBadge status={item.status} label={t(`status.${item.status}`)} /> },
          { key: "actions", header: t("tables.actions"), cell: (item) => <AdminBookingActions booking={item} t={t} /> },
        ]}
      />
      <PaginationFooter
        t={t}
        page={pagination?.page ?? page}
        totalPages={pagination?.totalPages ?? 1}
        onPrevious={() => setPage((current) => Math.max(1, current - 1))}
        onNext={() =>
          setPage((current) =>
            Math.min(pagination?.totalPages ?? current, current + 1)
          )
        }
      />
    </>
  );
}

export function AdminOrdersPage() {
  const t = useTranslations("AdminDashboard");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminOrders({ page, limit: 10 });
  const orders = data?.orders ?? [];
  const pagination = data?.pagination;

  return (
    <>
      <DashboardPageHeader title={t("pages.orders.title")} description={t("pages.orders.description")} />
      <SearchToolbar t={t} />
      <DashboardTable
        data={orders}
        getRowKey={(item) => item.id}
        isLoading={isLoading}
        columns={[
          { key: "id", header: t("tables.orderId"), cell: (item) => item.id_ORD ?? item.id },
          { key: "customer", header: t("tables.customer"), cell: (item) => item.customerName },
          { key: "trader", header: t("tables.trader"), cell: (item) => item.traderName },
          { key: "car", header: t("tables.car"), cell: (item) => item.carTitle },
          { key: "price", header: t("tables.price"), cell: (item) => formatAdminCurrency(item.price) },
          { key: "status", header: t("tables.orderStatus"), cell: (item) => {
            const status = item.status ?? item.orderStatus ?? "pending";
            return <AdminStatusBadge status={status} label={t(`status.${status}`)} />;
          } },
          { key: "actions", header: t("tables.actions"), cell: (item) => <AdminOrderActions order={item} t={t} /> },
        ]}
      />
      <PaginationFooter
        t={t}
        page={pagination?.page ?? page}
        totalPages={pagination?.totalPages ?? 1}
        onPrevious={() => setPage((current) => Math.max(1, current - 1))}
        onNext={() =>
          setPage((current) =>
            Math.min(pagination?.totalPages ?? current, current + 1)
          )
        }
      />
    </>
  );
}

function AdminBookingActions({
  booking,
  t,
}: {
  booking: AdminBooking;
  t: AdminTranslation;
}) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const bookingDetails = useAdminBooking(isDetailsOpen ? booking.id : null);
  const cancelBooking = useCancelAdminBooking();
  const isCancelled = booking.status === "cancelled";

  return (
    <>
      <AdminActions
        actions={[
          {
            label: t("actions.view"),
            icon: <Eye />,
            onClick: () => setIsDetailsOpen(true),
          },
          {
            label: t("actions.cancel"),
            icon: <XCircle />,
            variant: "destructive",
            disabled: isCancelled || cancelBooking.isPending,
            onClick: () => cancelBooking.mutate(booking.id),
          },
        ]}
      />

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("bookings.detailsTitle")}</DialogTitle>
            <DialogDescription>{booking.idBk ?? booking.id}</DialogDescription>
          </DialogHeader>
          {bookingDetails.isLoading ? (
            <p className="text-sm text-muted-foreground">{t("bookings.loadingDetails")}</p>
          ) : bookingDetails.data ? (
            <AdminBookingDetails booking={bookingDetails.data} />
          ) : (
            <p className="text-sm text-muted-foreground">{t("bookings.detailsEmpty")}</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function AdminOrderActions({
  order,
  t,
}: {
  order: AdminOrder;
  t: AdminTranslation;
}) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const orderDetails = useAdminOrder(isDetailsOpen ? order.id : null);
  const cancelOrder = useCancelAdminOrder();
  const status = order.status ?? order.orderStatus;
  const isCancelled = status === "cancelled";

  return (
    <>
      <AdminActions
        actions={[
          {
            label: t("actions.view"),
            icon: <Eye />,
            onClick: () => setIsDetailsOpen(true),
          },
          {
            label: t("actions.cancel"),
            icon: <XCircle />,
            variant: "destructive",
            disabled: isCancelled || cancelOrder.isPending,
            onClick: () => cancelOrder.mutate(order.id),
          },
        ]}
      />

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("orders.detailsTitle")}</DialogTitle>
            <DialogDescription>{order.id_ORD ?? order.id}</DialogDescription>
          </DialogHeader>
          {orderDetails.isLoading ? (
            <p className="text-sm text-muted-foreground">{t("orders.loadingDetails")}</p>
          ) : orderDetails.data ? (
            <AdminOrderDetails order={orderDetails.data} />
          ) : (
            <p className="text-sm text-muted-foreground">{t("orders.detailsEmpty")}</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function AdminBookingDetails({ booking }: { booking: AdminBookingDetail }) {
  const rows: Array<[string, string]> = [
    ["Booking", booking.displayId],
    ["Customer", booking.user?.userName ?? ""],
    ["Trader", booking.owner?.userName ?? ""],
    ["Car", booking.car ? `${booking.car.carbrand ?? ""} ${booking.car.carname ?? ""}`.trim() : ""],
    ["Start", formatAdminDate(booking.startDate)],
    ["End", formatAdminDate(booking.endDate)],
    ["Days", String(booking.totalDays)],
    ["Price / day", formatAdminCurrency(booking.priceperDay)],
    ["Total", formatAdminCurrency(booking.totalPrice)],
    ["Status", booking.status],
  ];

  return <AdminDetailGrid rows={rows} />;
}

function AdminOrderDetails({ order }: { order: AdminOrderDetail }) {
  const rows: Array<[string, string]> = [
    ["Order", order.displayId],
    ["Customer", order.user?.userName ?? ""],
    ["Trader", order.owner?.userName ?? ""],
    ["Car", order.car ? `${order.car.carbrand ?? ""} ${order.car.carname ?? ""}`.trim() : ""],
    ["Model", order.car?.carmodel ?? ""],
    ["Price", formatAdminCurrency(order.carprice)],
    ["Status", order.status],
    ["Created", formatAdminDate(order.createdAt)],
  ];

  return <AdminDetailGrid rows={rows} />;
}

function AdminDetailGrid({ rows }: { rows: Array<[string, string]> }) {
  return (
    <div className="grid gap-2 text-sm sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label} className="rounded-md border border-border p-3">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-1 font-medium text-foreground">{value || "-"}</p>
        </div>
      ))}
    </div>
  );
}

export function AdminReviewsPage() {
  const t = useTranslations("AdminDashboard");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminReviews({ page, limit: 10 });
  const reviews = data?.reviews ?? [];
  const pagination = data?.pagination;

  return (
    <>
      <DashboardPageHeader title={t("pages.reviews.title")} description={t("pages.reviews.description")} />
      <DashboardTable
        data={reviews}
        getRowKey={(item) => item.id}
        isLoading={isLoading}
        columns={[
          { key: "customer", header: t("tables.customer"), cell: (item) => item.customerName },
          { key: "car", header: t("tables.car"), cell: (item) => item.carTitle },
          { key: "rating", header: t("tables.rating"), cell: (item) => `${item.rating}/5` },
          { key: "review", header: t("tables.review"), cell: (item) => item.comment ?? item.review ?? "" },
          { key: "date", header: t("tables.date"), cell: (item) => item.date ? formatAdminDate(item.date) : "-" },
          { key: "actions", header: t("tables.actions"), cell: (item) => <AdminReviewActions reviewId={item.id} t={t} /> },
        ]}
      />
      <PaginationFooter
        t={t}
        page={pagination?.page ?? page}
        totalPages={pagination?.totalPages ?? 1}
        onPrevious={() => setPage((current) => Math.max(1, current - 1))}
        onNext={() =>
          setPage((current) =>
            Math.min(pagination?.totalPages ?? current, current + 1)
          )
        }
      />
    </>
  );
}

function AdminReviewActions({
  reviewId,
  t,
}: {
  reviewId: string;
  t: AdminTranslation;
}) {
  const deleteReview = useDeleteAdminReview();

  return (
    <AdminActions
      actions={[
        {
          label: t("actions.delete"),
          icon: <Trash2 />,
          variant: "destructive",
          disabled: deleteReview.isPending,
          onClick: () => deleteReview.mutate(reviewId),
        },
      ]}
    />
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
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminNotifications({ page, limit: 10 });
  const notifications = data?.notifications ?? [];
  const pagination = data?.pagination;

  return (
    <>
      <DashboardPageHeader
        title={t("pages.notifications.title")}
        description={t("pages.notifications.description")}
        action={<NotificationDialog t={t} />}
      />
      <SectionTitle>{t("sections.notificationHistory")}</SectionTitle>
      <DashboardTable
        data={notifications}
        getRowKey={(item) => item.id}
        isLoading={isLoading}
        columns={[
          { key: "title", header: t("tables.title"), cell: (item: AdminNotification) => item.title },
          { key: "message", header: t("tables.message"), cell: (item) => item.message },
          { key: "audience", header: t("tables.audience"), cell: (item) => t(`audience.${item.audience}`) },
          { key: "recipient", header: t("tables.recipient"), cell: (item) => item.recipientName ?? "-" },
          { key: "date", header: t("tables.createdAt"), cell: (item) => formatAdminDate(item.createdAt) },
          { key: "status", header: t("tables.status"), cell: (item) => <AdminStatusBadge status={item.status} label={t(`status.${item.status}`)} /> },
        ]}
      />
      <PaginationFooter
        t={t}
        page={pagination?.page ?? page}
        totalPages={pagination?.totalPages ?? 1}
        onPrevious={() => setPage((current) => Math.max(1, current - 1))}
        onNext={() =>
          setPage((current) =>
            Math.min(pagination?.totalPages ?? current, current + 1)
          )
        }
      />
    </>
  );
}

function NotificationDialog({ t }: { t: AdminTranslation }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] =
    useState<"all" | "users" | "traders">("users");
  const createNotification = useCreateAdminNotification();

  function submitNotification(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createNotification.mutate(
      {
        title: title.trim(),
        message: message.trim(),
        audience,
      },
      {
        onSuccess: () => {
          setTitle("");
          setMessage("");
          setAudience("users");
          setIsOpen(false);
        },
      }
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button />}>
        <Plus />
        {t("actions.createNotification")}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={submitNotification}>
          <DialogHeader>
            <DialogTitle>{t("notifications.createTitle")}</DialogTitle>
            <DialogDescription>{t("notifications.createDescription")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            <Label htmlFor="notification-title">{t("tables.title")}</Label>
            <Input
              id="notification-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={t("notifications.titlePlaceholder")}
              required
            />
            <Label htmlFor="notification-message">{t("tables.message")}</Label>
            <Input
              id="notification-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={t("notifications.messagePlaceholder")}
              required
            />
            <Label htmlFor="notification-audience">{t("tables.audience")}</Label>
            <select
              id="notification-audience"
              value={audience}
              onChange={(event) =>
                setAudience(event.target.value as "all" | "users" | "traders")
              }
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="users">{t("audience.users")}</option>
              <option value="traders">{t("audience.traders")}</option>
              <option value="all">{t("audience.all")}</option>
            </select>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={
                createNotification.isPending || !title.trim() || !message.trim()
              }
            >
              <Megaphone />
              {t("actions.broadcast")}
            </Button>
          </DialogFooter>
        </form>
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
