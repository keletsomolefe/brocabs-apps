/**
 * Driver Application Detail Page
 *
 * Comprehensive interface for reviewing and approving driver applications
 * including documents, banking details, vehicle info, vehicle photos, and operating zones.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Calendar,
  Car,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Eye,
  FileText,
  ImageIcon,
  Mail,
  Map as MapIcon,
  Phone,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge, Button } from "../../../components/ui";
import { adminApi } from "../../../lib/api";

export const Route = createFileRoute("/admin/drivers/$driverId")({
  component: DriverApplicationDetailPage,
});

/**
 * Check if image format is supported by browsers
 */
function isImageFormatSupported(url: string): boolean {
  const extension = url.split(".").pop()?.toLowerCase();
  const unsupportedFormats = ["heic", "heif"];
  return !unsupportedFormats.includes(extension || "");
}

type DocumentStatus = "pending" | "approved" | "rejected";

interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  status: DocumentStatus;
  rejectionReason?: string;
  expirationDate?: string;
}

interface BankingDetails {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  branchCode: string;
  accountType: string;
  status: DocumentStatus;
}

interface VehicleDetails {
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  vin?: string;
  status: DocumentStatus;
}

interface PaymentDetails {
  amount: number;
  status: string;
  paymentMethod: string;
  reference: string;
  paidAt: string;
}

interface DriverProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  address?: string;
  joinedDate: string;
  profileImage: string;
  banking: BankingDetails | null;
  vehicle: VehicleDetails | null;
  documents: Document[];
  vehiclePhotos: Document[];
  operatingZones: any[];
  status: string;
  payment?: PaymentDetails | null;
}

function DriverApplicationDetailPage() {
  const { driverId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Modals state
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  // Local verification state
  const [driverData, setDriverData] = useState<DriverProfile | null>(null);
  const [docRejectionReason, setDocRejectionReason] = useState("");

  const { data: application, isLoading } = useQuery({
    queryKey: ["driver-application", driverId],
    queryFn: () =>
      adminApi.adminControllerGetDriverApplication({ id: driverId }),
  });

  // Transform API data to local state for verification UI
  useEffect(() => {
    if (application) {
      const isAlreadyApproved = application.status === "APPROVED";
      const initialStatus: DocumentStatus = isAlreadyApproved
        ? "approved"
        : "pending";

      const documents: Document[] = (application.documents || []).map(
        (doc: any) => ({
          id: doc.id,
          name: doc.documentType,
          type: doc.documentType,
          url: doc.fileUrl,
          uploadedAt: doc.uploadedAt,
          status: initialStatus,
          expirationDate: doc.expirationDate,
        }),
      );

      const vehiclePhotos: Document[] = [];
      const submittedAtString = new Date(application.submittedAt).toISOString();

      if (application.vehicle) {
        (application.vehicle.exteriorImageUrls || []).forEach(
          (url: string, idx: number) => {
            if (url && url.trim()) {
              // Only add if URL is not empty
              vehiclePhotos.push({
                id: `ext-${idx}`,
                name: `Exterior View ${idx + 1}`,
                type: "Vehicle Photo",
                url: url,
                uploadedAt: submittedAtString,
                status: initialStatus,
              });
            }
          },
        );
        (application.vehicle.interiorImageUrls || []).forEach(
          (url: string, idx: number) => {
            if (url && url.trim()) {
              // Only add if URL is not empty
              vehiclePhotos.push({
                id: `int-${idx}`,
                name: `Interior View ${idx + 1}`,
                type: "Vehicle Photo",
                url: url,
                uploadedAt: submittedAtString,
                status: initialStatus,
              });
            }
          },
        );
      }

      setDriverData({
        id: application.id,
        fullName: application.fullName,
        email: application.email,
        phone: application.phoneNumber,
        joinedDate: submittedAtString,
        profileImage: String(application.avatarUrl || ""),
        status: application.status,
        payment: application.payment
          ? {
              amount: application.payment.amount,
              status: application.payment.status,
              paymentMethod: application.payment.paymentMethod,
              reference: application.payment.reference,
              paidAt: new Date(application.payment.paidAt).toISOString(),
            }
          : null,
        operatingZones: application.operatingZones || [],

        banking: application.bankDetails
          ? {
              accountHolderName: application.bankDetails.accountHolderName,
              bankName: application.bankDetails.bankName,
              accountNumber: application.bankDetails.accountNumber,
              branchCode: application.bankDetails.branchCode,
              accountType: application.bankDetails.accountType,
              status: initialStatus,
            }
          : null,

        vehicle: application.vehicle
          ? {
              make: application.vehicle.make,
              model: application.vehicle.model,
              year: 0,
              color: application.vehicle.colour,
              licensePlate: application.vehicle.registrationNumber,
              status: initialStatus,
            }
          : null,

        documents,
        vehiclePhotos,
      });
    }
  }, [application]);

  const approveMutation = useMutation({
    mutationFn: () =>
      adminApi.adminControllerApproveDriverApplication({
        id: driverId,
        approveDriverApplicationDto: { notes },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "driver-applications"],
      });
      queryClient.invalidateQueries({
        queryKey: ["driver-application", driverId],
      });
      setShowApproveModal(false);
      navigate({ to: "/admin/drivers" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: () =>
      adminApi.adminControllerRejectDriverApplication({
        id: driverId,
        rejectDriverApplicationDto: { reason: rejectionReason, notes },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "driver-applications"],
      });
      queryClient.invalidateQueries({
        queryKey: ["driver-application", driverId],
      });
      setShowRejectModal(false);
      navigate({ to: "/admin/drivers" });
    },
  });

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="danger" className="gap-1">
            <X className="h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="warning" className="gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
    }
  };

  const handleApproveDocument = (
    documentId: string,
    category: "documents" | "vehiclePhotos",
  ) => {
    if (!driverData) return;
    if (category === "documents") {
      setDriverData((prev) =>
        prev
          ? {
              ...prev,
              documents: prev.documents.map((doc) =>
                doc.id === documentId
                  ? { ...doc, status: "approved" as DocumentStatus }
                  : doc,
              ),
            }
          : null,
      );
    } else {
      setDriverData((prev) =>
        prev
          ? {
              ...prev,
              vehiclePhotos: prev.vehiclePhotos.map((photo) =>
                photo.id === documentId
                  ? { ...photo, status: "approved" as DocumentStatus }
                  : photo,
              ),
            }
          : null,
      );
    }
  };

  const handleRejectDocument = (
    documentId: string,
    category: "documents" | "vehiclePhotos",
  ) => {
    if (!driverData) return;
    if (category === "documents") {
      setDriverData((prev) =>
        prev
          ? {
              ...prev,
              documents: prev.documents.map((doc) =>
                doc.id === documentId
                  ? {
                      ...doc,
                      status: "rejected" as DocumentStatus,
                      rejectionReason: docRejectionReason,
                    }
                  : doc,
              ),
            }
          : null,
      );
    } else {
      setDriverData((prev) =>
        prev
          ? {
              ...prev,
              vehiclePhotos: prev.vehiclePhotos.map((photo) =>
                photo.id === documentId
                  ? {
                      ...photo,
                      status: "rejected" as DocumentStatus,
                      rejectionReason: docRejectionReason,
                    }
                  : photo,
              ),
            }
          : null,
      );
    }
    setDocRejectionReason("");
  };

  const handleApproveBanking = () => {
    setDriverData((prev) =>
      prev && prev.banking
        ? { ...prev, banking: { ...prev.banking, status: "approved" } }
        : prev,
    );
  };

  const handleRejectBanking = () => {
    setDriverData((prev) =>
      prev && prev.banking
        ? { ...prev, banking: { ...prev.banking, status: "rejected" } }
        : prev,
    );
  };

  const handleApproveVehicle = () => {
    setDriverData((prev) =>
      prev && prev.vehicle
        ? { ...prev, vehicle: { ...prev.vehicle, status: "approved" } }
        : prev,
    );
  };

  const handleRejectVehicle = () => {
    setDriverData((prev) =>
      prev && prev.vehicle
        ? { ...prev, vehicle: { ...prev.vehicle, status: "rejected" } }
        : prev,
    );
  };

  const handleQuickApproveAll = () => {
    setDriverData((prev) =>
      prev
        ? {
            ...prev,
            banking: prev.banking
              ? { ...prev.banking, status: "approved" }
              : null,
            vehicle: prev.vehicle
              ? { ...prev.vehicle, status: "approved" }
              : null,
            documents: prev.documents.map((doc) => ({
              ...doc,
              status: "approved" as DocumentStatus,
            })),
            vehiclePhotos: prev.vehiclePhotos.map((photo) => ({
              ...photo,
              status: "approved" as DocumentStatus,
            })),
          }
        : null,
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!driverData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-900">
            Application not found
          </h2>
          <p className="text-neutral-500 mt-2">
            The driver application could not be loaded.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate({ to: "/admin/drivers" })}
            className="mt-4"
          >
            Back to Drivers
          </Button>
        </div>
      </div>
    );
  }

  const isApproved = driverData.status === "APPROVED";
  const allItemsApproved =
    driverData.banking?.status === "approved" &&
    driverData.vehicle?.status === "approved" &&
    driverData.documents.every((d) => d.status === "approved") &&
    driverData.vehiclePhotos.every((p) => p.status === "approved");

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {driverData.profileImage ? (
            <img
              src={driverData.profileImage}
              alt={driverData.fullName}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-primary-600" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">
              {driverData.fullName}
            </h1>
            <p className="text-neutral-500">Driver Application Review</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isApproved && (
            <>
              <Button
                variant="outline"
                onClick={handleQuickApproveAll}
                leftIcon={Check}
              >
                Quick Approve All
              </Button>
              <Button
                variant="primary"
                onClick={() => setShowApproveModal(true)}
                disabled={!allItemsApproved}
                leftIcon={CheckCircle2}
              >
                Approve Application
              </Button>
              <Button
                variant="danger"
                onClick={() => setShowRejectModal(true)}
                leftIcon={X}
              >
                Reject
              </Button>
            </>
          )}
          {isApproved && (
            <Badge variant="success" className="text-base px-4 py-2">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Application Approved
            </Badge>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <User className="h-5 w-5" />
          Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-neutral-400" />
            <div>
              <p className="text-xs text-neutral-500">Email</p>
              <p className="text-sm font-medium">{driverData.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-neutral-400" />
            <div>
              <p className="text-xs text-neutral-500">Phone</p>
              <p className="text-sm font-medium">{driverData.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-neutral-400" />
            <div>
              <p className="text-xs text-neutral-500">Submitted</p>
              <p className="text-sm font-medium">
                {new Date(driverData.joinedDate).toLocaleDateString("en-ZA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      {driverData.payment && (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Application Fee Payment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-neutral-500">Amount</p>
              <p className="text-lg font-bold text-neutral-900">
                R {driverData.payment.amount.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Status</p>
              <Badge
                variant={
                  driverData.payment.status === "COMPLETED"
                    ? "success"
                    : driverData.payment.status === "PENDING"
                      ? "warning"
                      : "danger"
                }
              >
                {driverData.payment.status}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Method</p>
              <p className="text-sm font-medium">
                {driverData.payment.paymentMethod}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Reference</p>
              <p className="text-xs font-medium font-mono">
                {driverData.payment.reference}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Operating Zones */}
      {driverData.operatingZones && driverData.operatingZones.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <MapIcon className="h-5 w-5" />
            Service Areas
          </h2>
          <div className="flex flex-wrap gap-2">
            {driverData.operatingZones.map((zone: any) => (
              <div
                key={zone.id}
                className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium"
              >
                {zone.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Banking Details */}
      {driverData.banking && (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Banking Details
            </h2>
            {getStatusBadge(driverData.banking.status)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-neutral-500">Account Holder</p>
              <p className="text-sm font-medium">
                {driverData.banking.accountHolderName}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Bank Name</p>
              <p className="text-sm font-medium">
                {driverData.banking.bankName}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Account Number</p>
              <p className="text-sm font-medium font-mono">
                {driverData.banking.accountNumber}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Branch Code</p>
              <p className="text-sm font-medium">
                {driverData.banking.branchCode}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Account Type</p>
              <p className="text-sm font-medium">
                {driverData.banking.accountType}
              </p>
            </div>
          </div>
          {!isApproved && driverData.banking.status === "pending" && (
            <div className="flex gap-2 mt-4">
              <Button
                variant="primary"
                size="sm"
                onClick={handleApproveBanking}
                leftIcon={Check}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleRejectBanking}
                leftIcon={X}
              >
                Reject
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Vehicle Details */}
      {driverData.vehicle && (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <Car className="h-5 w-5" />
              Vehicle Information
            </h2>
            {getStatusBadge(driverData.vehicle.status)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-neutral-500">Make & Model</p>
              <p className="text-sm font-medium">
                {driverData.vehicle.make} {driverData.vehicle.model}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Color</p>
              <p className="text-sm font-medium">{driverData.vehicle.color}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">License Plate</p>
              <p className="text-sm font-medium font-mono">
                {driverData.vehicle.licensePlate}
              </p>
            </div>
          </div>
          {!isApproved && driverData.vehicle.status === "pending" && (
            <div className="flex gap-2 mt-4">
              <Button
                variant="primary"
                size="sm"
                onClick={handleApproveVehicle}
                leftIcon={Check}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleRejectVehicle}
                leftIcon={X}
              >
                Reject
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Documents */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Driver Documents
        </h2>
        <div className="space-y-3">
          {driverData.documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 border border-neutral-200 rounded-xl hover:border-neutral-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-neutral-400" />
                <div>
                  <p className="font-medium text-neutral-900">{doc.name}</p>
                  <p className="text-xs text-neutral-500">
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(doc.status)}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(doc.url, "_blank")}
                  leftIcon={Eye}
                >
                  View
                </Button>
                {!isApproved && doc.status === "pending" && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApproveDocument(doc.id, "documents")}
                      leftIcon={Check}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        if (docRejectionReason) {
                          handleRejectDocument(doc.id, "documents");
                        } else {
                          const reason = prompt("Enter rejection reason:");
                          if (reason) {
                            setDocRejectionReason(reason);
                            handleRejectDocument(doc.id, "documents");
                          }
                        }
                      }}
                      leftIcon={X}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vehicle Photos */}
      {driverData.vehiclePhotos.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Vehicle Photos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {driverData.vehiclePhotos.map((photo) => (
              <div
                key={photo.id}
                className="border border-neutral-200 rounded-xl overflow-hidden"
              >
                {isImageFormatSupported(photo.url) ? (
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => {
                      setPreviewImageUrl(photo.url);
                      setShowImagePreview(true);
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-neutral-100 flex flex-col items-center justify-center gap-2">
                    <ImageIcon className="h-12 w-12 text-neutral-400" />
                    <p className="text-xs text-neutral-600">HEIC format</p>
                    <a
                      href={photo.url}
                      download
                      className="text-xs text-primary-600 hover:text-primary-700 underline"
                    >
                      Download to view
                    </a>
                  </div>
                )}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-neutral-900">
                      {photo.name}
                    </p>
                    {getStatusBadge(photo.status)}
                  </div>
                  {!isApproved && photo.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() =>
                          handleApproveDocument(photo.id, "vehiclePhotos")
                        }
                        leftIcon={Check}
                        className="flex-1"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          if (docRejectionReason) {
                            handleRejectDocument(photo.id, "vehiclePhotos");
                          } else {
                            const reason = prompt("Enter rejection reason:");
                            if (reason) {
                              setDocRejectionReason(reason);
                              handleRejectDocument(photo.id, "vehiclePhotos");
                            }
                          }
                        }}
                        leftIcon={X}
                        className="flex-1"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Approve Driver Application
            </h3>
            <p className="text-neutral-600 mb-4">
              Are you sure you want to approve this driver application? The
              driver will be notified and can start accepting rides.
            </p>
            <textarea
              placeholder="Optional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-200 rounded-xl resize-none mb-4"
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowApproveModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => approveMutation.mutate()}
                isLoading={approveMutation.isPending}
                className="flex-1"
              >
                Approve
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Reject Driver Application
            </h3>
            <p className="text-neutral-600 mb-4">
              Please provide a reason for rejecting this application. The driver
              will be notified.
            </p>
            <textarea
              placeholder="Rejection reason (required)"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-200 rounded-xl resize-none mb-2"
              rows={3}
            />
            <textarea
              placeholder="Additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-200 rounded-xl resize-none mb-4"
              rows={2}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowRejectModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => rejectMutation.mutate()}
                disabled={!rejectionReason}
                isLoading={rejectMutation.isPending}
                className="flex-1"
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImagePreview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImagePreview(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowImagePreview(false)}
              className="absolute -top-10 right-0 text-white hover:text-neutral-300"
            >
              <X className="h-8 w-8" />
            </button>
            <img
              src={previewImageUrl}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
