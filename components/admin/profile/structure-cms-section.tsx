"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    MapPin,
    Plus,
    Edit2,
    Trash2,
    GripVertical,
    Save,
    X,
    Upload,
    Loader2,
    AlertCircle,
    Check,
    Calendar,
    User,
} from "lucide-react";
import Image from "next/image";
import {
    createStructurePosition,
    updateStructurePosition,
    deleteStructurePosition,
    createStructureMember,
    updateStructureMember,
    deleteStructureMember,
} from "@/lib/actions/admin";
import { createClient } from "@/utils/supabase/client";

interface StructureMember {
    id: string;
    position_id: string;
    name: string;
    photo_url: string | null;
    dusun: string | null;
    member_order: number | null;
    bio: string | null;
    motto: string | null;
    social_links: any;
    created_at: string;
}

interface StructurePosition {
    id: string;
    position_name: string;
    position_order: number;
    is_core: boolean;
    tenure_period: string | null;
    created_at: string;
    structure_members?: StructureMember[];
}

interface StructureCMSSectionProps {
    onDataChange: () => void;
}

const DUSUN_LIST = ["Pakutukan", "Watugel", "Paras", "Ampelgading"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export function StructureCMSSection({ onDataChange }: StructureCMSSectionProps) {
    const [activeTab, setActiveTab] = useState<"core" | "dusun">("core");
    const [positions, setPositions] = useState<StructurePosition[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Modals
    const [positionModal, setPositionModal] = useState<{
        open: boolean;
        mode: "add" | "edit";
        position?: StructurePosition;
    }>({ open: false, mode: "add" });

    const [memberModal, setMemberModal] = useState<{
        open: boolean;
        mode: "add" | "edit";
        positionId?: string;
        member?: StructureMember;
        dusun?: string;
    }>({ open: false, mode: "add" });

    const [deleteConfirm, setDeleteConfirm] = useState<{
        open: boolean;
        type: "position" | "member";
        id: string;
        name: string;
    } | null>(null);

    useEffect(() => {
        loadPositions();
    }, [activeTab]);

    const loadPositions = async () => {
        setLoading(true);
        try {
            const { getStructurePositions } = await import("@/lib/api/client-admin");
            const data = await getStructurePositions();

            const filtered = data.filter((p: StructurePosition) =>
                activeTab === "core" ? p.is_core : !p.is_core
            );

            setPositions(filtered.sort((a, b) => a.position_order - b.position_order));
        } catch (err) {
            console.error("Error loading positions:", err);
            setError("Gagal memuat data");
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePosition = async (id: string) => {
        try {
            const result = await deleteStructurePosition(id);
            if (result.success) {
                setSuccess("Jabatan berhasil dihapus");
                setTimeout(() => setSuccess(null), 3000);
                loadPositions();
                onDataChange();
            } else {
                setError(result.error || "Gagal menghapus jabatan");
            }
        } catch (err) {
            setError("Terjadi kesalahan");
        }
        setDeleteConfirm(null);
    };

    const handleDeleteMember = async (id: string) => {
        try {
            const result = await deleteStructureMember(id);
            if (result.success) {
                setSuccess("Anggota berhasil dihapus");
                setTimeout(() => setSuccess(null), 3000);
                loadPositions();
                onDataChange();
            } else {
                setError(result.error || "Gagal menghapus anggota");
            }
        } catch (err) {
            setError("Terjadi kesalahan");
        }
        setDeleteConfirm(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">Kelola Struktur Organisasi</h3>
                    <p className="text-gray-600 mt-1">
                        Tambah, edit, atau hapus jabatan dan anggota struktur organisasi
                    </p>
                </div>
            </div>

            {/* Success/Error Messages */}
            <AnimatePresence>
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3"
                    >
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-700">{success}</p>
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
                    >
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm text-red-700">{error}</p>
                            <button
                                onClick={() => setError(null)}
                                className="text-xs text-red-600 hover:text-red-700 mt-1 underline"
                            >
                                Tutup
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab("core")}
                    className={`px-6 py-3 font-semibold transition-all ${activeTab === "core"
                        ? "text-emerald-700 border-b-2 border-emerald-600"
                        : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        <span>Pengurus Inti</span>
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab("dusun")}
                    className={`px-6 py-3 font-semibold transition-all ${activeTab === "dusun"
                        ? "text-emerald-700 border-b-2 border-emerald-600"
                        : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        <span>Koordinator Dusun</span>
                    </div>
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                </div>
            ) : (
                <>
                    {activeTab === "core" ? (
                        <CoreStructureManagement
                            positions={positions}
                            onAddPosition={() => setPositionModal({ open: true, mode: "add" })}
                            onEditPosition={(position) =>
                                setPositionModal({ open: true, mode: "edit", position })
                            }
                            onDeletePosition={(id, name) =>
                                setDeleteConfirm({ open: true, type: "position", id, name })
                            }
                            onAddMember={(positionId) =>
                                setMemberModal({ open: true, mode: "add", positionId })
                            }
                            onEditMember={(member) =>
                                setMemberModal({ open: true, mode: "edit", member })
                            }
                            onDeleteMember={(id, name) =>
                                setDeleteConfirm({ open: true, type: "member", id, name })
                            }
                            onReload={loadPositions}
                        />
                    ) : (
                        <DusunStructureManagement
                            positions={positions}
                            onAddMember={(dusun) =>
                                setMemberModal({ open: true, mode: "add", dusun })
                            }
                            onEditMember={(member) =>
                                setMemberModal({ open: true, mode: "edit", member })
                            }
                            onDeleteMember={(id, name) =>
                                setDeleteConfirm({ open: true, type: "member", id, name })
                            }
                            onReload={loadPositions}
                        />
                    )}
                </>
            )}

            {/* Modals */}
            <PositionModal
                {...positionModal}
                isCore={activeTab === "core"}
                onClose={() => setPositionModal({ open: false, mode: "add" })}
                onSuccess={() => {
                    loadPositions();
                    onDataChange();
                    setPositionModal({ open: false, mode: "add" });
                    setSuccess(
                        positionModal.mode === "add"
                            ? "Jabatan berhasil ditambahkan"
                            : "Jabatan berhasil diperbarui"
                    );
                    setTimeout(() => setSuccess(null), 3000);
                }}
                onError={(msg) => setError(msg)}
            />

            <MemberModal
                {...memberModal}
                isCore={activeTab === "core"}
                positions={positions}
                onClose={() => setMemberModal({ open: false, mode: "add" })}
                onSuccess={() => {
                    loadPositions();
                    onDataChange();
                    setMemberModal({ open: false, mode: "add" });
                    setSuccess(
                        memberModal.mode === "add"
                            ? "Anggota berhasil ditambahkan"
                            : "Anggota berhasil diperbarui"
                    );
                    setTimeout(() => setSuccess(null), 3000);
                }}
                onError={(msg) => setError(msg)}
            />

            <DeleteConfirmModal
                open={deleteConfirm?.open || false}
                type={deleteConfirm?.type || "member"}
                name={deleteConfirm?.name || ""}
                onConfirm={() => {
                    if (!deleteConfirm) return;
                    if (deleteConfirm.type === "position") {
                        handleDeletePosition(deleteConfirm.id);
                    } else {
                        handleDeleteMember(deleteConfirm.id);
                    }
                }}
                onCancel={() => setDeleteConfirm(null)}
            />
        </div>
    );
}

// Core Structure Management Component
function CoreStructureManagement({
    positions,
    onAddPosition,
    onEditPosition,
    onDeletePosition,
    onAddMember,
    onEditMember,
    onDeleteMember,
    onReload,
}: {
    positions: StructurePosition[];
    onAddPosition: () => void;
    onEditPosition: (position: StructurePosition) => void;
    onDeletePosition: (id: string, name: string) => void;
    onAddMember: (positionId: string) => void;
    onEditMember: (member: StructureMember) => void;
    onDeleteMember: (id: string, name: string) => void;
    onReload: () => void;
}) {
    return (
        <div className="space-y-6">
            {/* Add Position Button */}
            <button
                onClick={onAddPosition}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
            >
                <Plus className="w-5 h-5" />
                <span>Tambah Jabatan</span>
            </button>

            {/* Positions List */}
            <div className="space-y-4">
                {positions.map((position) => (
                    <div
                        key={position.id}
                        className="bg-white border border-gray-200 rounded-lg p-6 space-y-4"
                    >
                        {/* Position Header */}
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900">
                                            {position.position_name}
                                        </h4>
                                        {position.tenure_period && (
                                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                                <Calendar className="w-4 h-4" />
                                                Masa Bakti: {position.tenure_period}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onEditPosition(position)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit Jabatan"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onDeletePosition(position.id, position.position_name)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Hapus Jabatan"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Members */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h5 className="text-sm font-semibold text-gray-700">Anggota</h5>
                                <button
                                    onClick={() => onAddMember(position.id)}
                                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Tambah Pengurus</span>
                                </button>
                            </div>

                            {position.structure_members && position.structure_members.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {position.structure_members
                                        .sort((a, b) => (a.member_order || 0) - (b.member_order || 0))
                                        .map((member) => (
                                            <div
                                                key={member.id}
                                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group"
                                            >
                                                {/* Photo */}
                                                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                                    {member.photo_url ? (
                                                        <Image
                                                            src={member.photo_url}
                                                            alt={member.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <User className="w-6 h-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-900 truncate">
                                                        {member.name}
                                                    </p>
                                                    {member.bio && (
                                                        <p className="text-xs text-gray-600 truncate">{member.bio}</p>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => onEditMember(member)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => onDeleteMember(member.id, member.name)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">
                                    Belum ada anggota
                                </p>
                            )}
                        </div>
                    </div>
                ))}

                {positions.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Belum ada jabatan. Klik "Tambah Jabatan" untuk memulai.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Dusun Structure Management Component
function DusunStructureManagement({
    positions,
    onAddMember,
    onEditMember,
    onDeleteMember,
    onReload,
}: {
    positions: StructurePosition[];
    onAddMember: (dusun: string) => void;
    onEditMember: (member: StructureMember) => void;
    onDeleteMember: (id: string, name: string) => void;
    onReload: () => void;
}) {
    const [expandedDusun, setExpandedDusun] = useState<Set<string>>(new Set(DUSUN_LIST));

    const toggleDusun = (dusun: string) => {
        const newExpanded = new Set(expandedDusun);
        if (newExpanded.has(dusun)) {
            newExpanded.delete(dusun);
        } else {
            newExpanded.add(dusun);
        }
        setExpandedDusun(newExpanded);
    };

    // Group members by dusun
    const membersByDusun: Record<string, StructureMember[]> = {};
    DUSUN_LIST.forEach((dusun) => {
        membersByDusun[dusun] = [];
    });

    positions.forEach((position) => {
        position.structure_members?.forEach((member) => {
            if (member.dusun && DUSUN_LIST.includes(member.dusun)) {
                membersByDusun[member.dusun].push(member);
            }
        });
    });

    const getDusunColor = (dusun: string) => {
        const colors: Record<string, { bg: string; text: string; border: string }> = {
            Pakutukan: { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-300" },
            Watugel: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" },
            Paras: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300" },
            Ampelgading: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-300" },
        };
        return colors[dusun] || { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300" };
    };

    return (
        <div className="space-y-4">
            {DUSUN_LIST.map((dusun) => {
                const members = membersByDusun[dusun].sort(
                    (a, b) => (a.member_order || 0) - (b.member_order || 0)
                );
                const coordinator = members.find((m) => m.member_order === 0);
                const otherMembers = members.filter((m) => m.member_order !== 0);
                const colors = getDusunColor(dusun);
                const isExpanded = expandedDusun.has(dusun);

                return (
                    <div key={dusun} className={`border-2 rounded-lg overflow-hidden ${colors.border}`}>
                        {/* Header */}
                        <div
                            onClick={() => toggleDusun(dusun)}
                            className={`w-full flex items-center justify-between p-5 hover:opacity-90 transition-opacity cursor-pointer ${isExpanded ? `bg-gradient-to-r ${colors.bg}` : "bg-white"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center`}>
                                    <MapPin className={`w-6 h-6 ${colors.text}`} />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-lg font-bold text-gray-900">Dusun {dusun}</h4>
                                    <p className="text-sm text-gray-600">
                                        {coordinator ? coordinator.name : "Belum ada koordinator"} • {members.length} anggota
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAddMember(dusun);
                                    }}
                                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Tambah</span>
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        {isExpanded && (
                            <div className={`p-6 border-t-2 ${colors.border} ${colors.bg}`}>
                                {members.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {members.map((member) => (
                                            <div
                                                key={member.id}
                                                className="bg-white rounded-lg p-4 shadow-sm group"
                                            >
                                                <div className="flex items-center gap-3 mb-3">
                                                    {/* Photo */}
                                                    <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                                        {member.photo_url ? (
                                                            <Image
                                                                src={member.photo_url}
                                                                alt={member.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <User className="w-7 h-7 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-gray-900 truncate">
                                                            {member.name}
                                                        </p>
                                                        {member.member_order === 0 && (
                                                            <span className="inline-block text-xs font-bold text-emerald-600 mt-1">
                                                                KOORDINATOR
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {member.bio && (
                                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{member.bio}</p>
                                                )}

                                                {/* Actions */}
                                                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                                                    <button
                                                        onClick={() => onEditMember(member)}
                                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                        <span>Edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => onDeleteMember(member.id, member.name)}
                                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        <span>Hapus</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 py-8">
                                        Belum ada anggota terdaftar
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// Position Modal Component
function PositionModal({
    open,
    mode,
    position,
    isCore,
    onClose,
    onSuccess,
    onError,
}: {
    open: boolean;
    mode: "add" | "edit";
    position?: StructurePosition;
    isCore: boolean;
    onClose: () => void;
    onSuccess: () => void;
    onError: (msg: string) => void;
}) {
    const [formData, setFormData] = useState({
        position_name: "",
        tenure_period: "",
        position_order: 0,
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (open && position) {
            setFormData({
                position_name: position.position_name,
                tenure_period: position.tenure_period || "",
                position_order: position.position_order,
            });
        } else if (open) {
            setFormData({
                position_name: "",
                tenure_period: "",
                position_order: 0,
            });
        }
    }, [open, position]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (mode === "add") {
                const result = await createStructurePosition({
                    position_name: formData.position_name,
                    position_order: formData.position_order,
                    is_core: isCore,
                    tenure_period: formData.tenure_period || null,
                });

                if (result.success) {
                    onSuccess();
                } else {
                    onError(result.error || "Gagal menambahkan jabatan");
                }
            } else if (position) {
                const result = await updateStructurePosition(position.id, {
                    position_name: formData.position_name,
                    tenure_period: formData.tenure_period || null,
                });

                if (result.success) {
                    onSuccess();
                } else {
                    onError(result.error || "Gagal memperbarui jabatan");
                }
            }
        } catch (err) {
            onError("Terjadi kesalahan");
        } finally {
            setSaving(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-xl shadow-2xl max-w-md w-full"
            >
                <form onSubmit={handleSubmit}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h3 className="text-xl font-bold text-gray-900">
                            {mode === "add" ? "Tambah Jabatan" : "Edit Jabatan"}
                        </h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Nama Jabatan <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.position_name}
                                onChange={(e) =>
                                    setFormData({ ...formData, position_name: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Contoh: Ketua, Sekretaris, Bendahara"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Masa Bakti
                            </label>
                            <input
                                type="text"
                                value={formData.tenure_period}
                                onChange={(e) =>
                                    setFormData({ ...formData, tenure_period: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Contoh: 2024-2026"
                            />
                        </div>

                        {mode === "add" && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Urutan Tampil
                                </label>
                                <input
                                    type="number"
                                    value={formData.position_order}
                                    onChange={(e) =>
                                        setFormData({ ...formData, position_order: parseInt(e.target.value) })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    min="0"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Semakin kecil angka, semakin atas posisinya
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            disabled={saving}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50"
                            disabled={saving}
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Menyimpan...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>Simpan</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

// Member Modal Component
function MemberModal({
    open,
    mode,
    member,
    positionId,
    dusun,
    isCore,
    positions,
    onClose,
    onSuccess,
    onError,
}: {
    open: boolean;
    mode: "add" | "edit";
    member?: StructureMember;
    positionId?: string;
    dusun?: string;
    isCore: boolean;
    positions: StructurePosition[];
    onClose: () => void;
    onSuccess: () => void;
    onError: (msg: string) => void;
}) {
    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        member_order: 0,
        position_id: "",
        dusun: "",
        photo: null as File | null,
    });
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (open && member) {
            setFormData({
                name: member.name,
                bio: member.bio || "",
                member_order: member.member_order || 0,
                position_id: member.position_id,
                dusun: member.dusun || "",
                photo: null,
            });
            setPhotoPreview(member.photo_url);
        } else if (open) {
            setFormData({
                name: "",
                bio: "",
                member_order: 0,
                position_id: positionId || "",
                dusun: dusun || "",
                photo: null,
            });
            setPhotoPreview(null);
        }
    }, [open, member, positionId, dusun]);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (2MB)
        if (file.size > MAX_FILE_SIZE) {
            onError("Ukuran file maksimal 2MB");
            return;
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
            onError("File harus berupa gambar");
            return;
        }

        setFormData({ ...formData, photo: file });
        setPhotoPreview(URL.createObjectURL(file));
    };

    const uploadPhoto = async (file: File): Promise<string | null> => {
        setUploading(true);
        try {
            const supabase = createClient();
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `structure-photos/${fileName}`;

            const { data, error } = await supabase.storage
                .from("public-assets")
                .upload(filePath, file);

            if (error) throw error;

            const {
                data: { publicUrl },
            } = supabase.storage.from("public-assets").getPublicUrl(filePath);

            return publicUrl;
        } catch (err) {
            console.error("Error uploading photo:", err);
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            let photoUrl = member?.photo_url || null;

            // Upload photo if new file selected
            if (formData.photo) {
                const uploadedUrl = await uploadPhoto(formData.photo);
                if (uploadedUrl) {
                    photoUrl = uploadedUrl;
                } else {
                    onError("Gagal mengupload foto");
                    setSaving(false);
                    return;
                }
            }

            if (mode === "add") {
                const result = await createStructureMember({
                    name: formData.name,
                    bio: formData.bio || null,
                    member_order: formData.member_order,
                    position_id: formData.position_id,
                    dusun: formData.dusun || null,
                    photo_url: photoUrl,
                });

                if (result.success) {
                    onSuccess();
                } else {
                    onError(result.error || "Gagal menambahkan anggota");
                }
            } else if (member) {
                const result = await updateStructureMember(member.id, {
                    name: formData.name,
                    bio: formData.bio || null,
                    photo_url: photoUrl,
                });

                if (result.success) {
                    onSuccess();
                } else {
                    onError(result.error || "Gagal memperbarui anggota");
                }
            }
        } catch (err) {
            onError("Terjadi kesalahan");
        } finally {
            setSaving(false);
        }
    };

    if (!open) return null;

    // For dusun, create virtual positions
    const availablePositions = isCore
        ? positions
        : [
            { id: "coordinator", position_name: "Koordinator" },
            { id: "member", position_name: "Anggota" },
        ];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
                <form onSubmit={handleSubmit}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                        <h3 className="text-xl font-bold text-gray-900">
                            {mode === "add" ? "Tambah Anggota" : "Edit Anggota"}
                        </h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-4">
                        {/* Photo Upload */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Foto
                            </label>
                            <div className="flex items-center gap-4">
                                {/* Preview */}
                                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                    {photoPreview ? (
                                        <Image
                                            src={photoPreview}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <User className="w-10 h-10 text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Upload Button */}
                                <div className="flex-1">
                                    <label className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-500 cursor-pointer transition-colors">
                                        <Upload className="w-4 h-4 text-gray-600" />
                                        <span className="text-sm text-gray-600">Upload Foto</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                            className="hidden"
                                        />
                                    </label>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Max 2MB, format: JPG, PNG
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Nama <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Nama lengkap"
                                required
                            />
                        </div>

                        {/* Position/Role */}
                        {!isCore && mode === "add" && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Posisi <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.member_order}
                                    onChange={(e) =>
                                        setFormData({ ...formData, member_order: parseInt(e.target.value) })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    required
                                >
                                    <option value={0}>Koordinator</option>
                                    <option value={1}>Anggota</option>
                                </select>
                            </div>
                        )}

                        {/* Position for Core */}
                        {isCore && mode === "add" && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Jabatan <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.position_id}
                                    onChange={(e) =>
                                        setFormData({ ...formData, position_id: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    required
                                >
                                    <option value="">Pilih Jabatan</option>
                                    {positions.map((pos) => (
                                        <option key={pos.id} value={pos.id}>
                                            {pos.position_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Bio (Opsional)
                            </label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Profil singkat..."
                                rows={3}
                            />
                        </div>

                        {/* Order for Core */}
                        {isCore && mode === "add" && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Urutan Tampil
                                </label>
                                <input
                                    type="number"
                                    value={formData.member_order}
                                    onChange={(e) =>
                                        setFormData({ ...formData, member_order: parseInt(e.target.value) })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    min="0"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Semakin kecil angka, semakin atas posisinya
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 sticky bottom-0 bg-white">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            disabled={saving || uploading}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50"
                            disabled={saving || uploading}
                        >
                            {saving || uploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>{uploading ? "Mengupload..." : "Menyimpan..."}</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>Simpan</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

// Delete Confirm Modal
function DeleteConfirmModal({
    open,
    type,
    name,
    onConfirm,
    onCancel,
}: {
    open: boolean;
    type: "position" | "member";
    name: string;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            >
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Konfirmasi Hapus</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Apakah Anda yakin ingin menghapus {type === "position" ? "jabatan" : "anggota"}{" "}
                            <span className="font-semibold">{name}</span>?
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                        Hapus
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
