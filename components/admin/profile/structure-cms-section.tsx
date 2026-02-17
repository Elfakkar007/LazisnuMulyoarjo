"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    MapPin,
    Plus,
    Edit2,
    Trash2,
    Save,
    X,
    Upload,
    Loader2,
    AlertCircle,
    Check,
    User,
    Image as ImageIcon,
    RefreshCw,
    Move,
    ZoomIn,
    ZoomOut,
    RotateCw,
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
    position_role?: string;
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

interface CropArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

const DUSUN_LIST = ["Pakutukan", "Watugel", "Paras", "Ampelgading"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const DUSUN_ROLES = ["Koordinator", "Anggota"];

export function StructureCMSSection({ onDataChange }: StructureCMSSectionProps) {
    const [activeTab, setActiveTab] = useState<"core" | "dusun">("core");
    const [positions, setPositions] = useState<StructurePosition[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

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
    }, []);

    const loadPositions = async (forceRefresh = false) => {
        if (forceRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        try {
            const supabase = createClient();
            const { data, error: fetchError } = await supabase
                .from('structure_positions')
                .select(`
                    id,
                    position_name,
                    position_order,
                    is_core,
                    tenure_period,
                    created_at,
                    structure_members (
                        id,
                        position_id,
                        name,
                        photo_url,
                        dusun,
                        member_order,
                        bio,
                        motto,
                        social_links,
                        created_at
                    )
                `)
                .order('position_order', { ascending: true });

            if (fetchError) throw fetchError;
            setPositions(data || []);
        } catch (err) {
            console.error("Error loading positions:", err);
            setError("Gagal memuat data: " + (err as Error).message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const filteredPositions = positions.filter(pos => pos.is_core === (activeTab === 'core'));

    const handleDeletePosition = async (id: string) => {
        try {
            const result = await deleteStructurePosition(id);
            if (result.success) {
                setSuccess("Jabatan berhasil dihapus");
                setTimeout(() => setSuccess(null), 3000);
                await loadPositions(true);
                onDataChange();
            } else {
                setError((result as any).message || "Gagal menghapus jabatan");
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
                await loadPositions(true);
                onDataChange();
            } else {
                setError((result as any).message || "Gagal menghapus anggota");
            }
        } catch (err) {
            setError("Terjadi kesalahan");
        }
        setDeleteConfirm(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">Kelola Struktur Organisasi</h3>
                    <p className="text-gray-600 mt-1">
                        Tambah, edit, atau hapus jabatan dan anggota struktur organisasi
                    </p>
                </div>
                <button
                    onClick={() => loadPositions(true)}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                </button>
            </div>

            {/* Alerts */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        key="error-alert"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
                    >
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <p className="text-red-800">{error}</p>
                        <button onClick={() => setError(null)} className="ml-auto">
                            <X className="w-4 h-4 text-red-600" />
                        </button>
                    </motion.div>
                )}

                {success && (
                    <motion.div
                        key="success-alert"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg"
                    >
                        <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <p className="text-emerald-800">{success}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('core')}
                    className={`px-6 py-3 font-semibold transition-colors relative ${activeTab === 'core'
                        ? 'text-emerald-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Users className="w-4 h-4 inline-block mr-2" />
                    Pengurus Inti
                    {activeTab === 'core' && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"
                        />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('dusun')}
                    className={`px-6 py-3 font-semibold transition-colors relative ${activeTab === 'dusun'
                        ? 'text-emerald-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <MapPin className="w-4 h-4 inline-block mr-2" />
                    Pengurus Dusun
                    {activeTab === 'dusun' && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"
                        />
                    )}
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Add Position Button */}
                    <button
                        onClick={() => setPositionModal({ open: true, mode: 'add' })}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Jabatan {activeTab === 'core' ? 'Inti' : 'Dusun'}</span>
                    </button>

                    {/* Positions List */}
                    {filteredPositions.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600">
                                Belum ada jabatan {activeTab === 'core' ? 'inti' : 'dusun'}.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredPositions.map((position) => (
                                <PositionCard
                                    key={position.id}
                                    position={position}
                                    onEdit={() => setPositionModal({ open: true, mode: 'edit', position })}
                                    onDelete={() => setDeleteConfirm({
                                        open: true,
                                        type: 'position',
                                        id: position.id,
                                        name: position.position_name,
                                    })}
                                    onAddMember={(positionId) => setMemberModal({
                                        open: true,
                                        mode: 'add',
                                        positionId,
                                        dusun: position.structure_members?.[0]?.dusun || (position.position_name || "").replace("Dusun ", ""),
                                    })}
                                    onEditMember={(member) => setMemberModal({
                                        open: true,
                                        mode: 'edit',
                                        positionId: member.position_id,
                                        member,
                                        dusun: member.dusun || undefined,
                                    })}
                                    onDeleteMember={(member) => setDeleteConfirm({
                                        open: true,
                                        type: 'member',
                                        id: member.id,
                                        name: member.name,
                                    })}
                                    isCore={activeTab === 'core'}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Modals */}
            <PositionModal
                open={positionModal.open}
                mode={positionModal.mode}
                position={positionModal.position}
                isCore={activeTab === 'core'}
                onClose={() => setPositionModal({ open: false, mode: 'add' })}
                onSuccess={async () => {
                    setPositionModal({ open: false, mode: 'add' });
                    setSuccess(`Jabatan berhasil ${positionModal.mode === 'add' ? 'ditambahkan' : 'diperbarui'}`);
                    setTimeout(() => setSuccess(null), 3000);
                    await loadPositions(true);
                    onDataChange();
                }}
                onError={(msg) => setError(msg)}
            />

            <MemberModal
                open={memberModal.open}
                mode={memberModal.mode}
                positionId={memberModal.positionId || ''}
                member={memberModal.member}
                dusun={memberModal.dusun}
                isCore={activeTab === 'core'}
                onClose={() => setMemberModal({ open: false, mode: 'add' })}
                onSuccess={async () => {
                    setMemberModal({ open: false, mode: 'add' });
                    setSuccess(`Anggota berhasil ${memberModal.mode === 'add' ? 'ditambahkan' : 'diperbarui'}`);
                    setTimeout(() => setSuccess(null), 3000);
                    await loadPositions(true);
                    onDataChange();
                }}
                onError={(msg) => setError(msg)}
            />

            {deleteConfirm && (
                <DeleteConfirmModal
                    open={deleteConfirm.open}
                    type={deleteConfirm.type}
                    name={deleteConfirm.name}
                    onConfirm={() => {
                        if (deleteConfirm.type === 'position') {
                            handleDeletePosition(deleteConfirm.id);
                        } else {
                            handleDeleteMember(deleteConfirm.id);
                        }
                    }}
                    onCancel={() => setDeleteConfirm(null)}
                />
            )}
        </div>
    );
}

// Position Card Component
function PositionCard({
    position,
    onEdit,
    onDelete,
    onAddMember,
    onEditMember,
    onDeleteMember,
    isCore,
}: {
    position: StructurePosition;
    onEdit: () => void;
    onDelete: () => void;
    onAddMember: (positionId: string) => void;
    onEditMember: (member: StructureMember) => void;
    onDeleteMember: (member: StructureMember) => void;
    isCore: boolean;
}) {
    const members = position.structure_members || [];

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-gray-900">{position.position_name}</h4>
                    <p className="text-sm text-gray-600">
                        Urutan: {position.position_order}
                        {position.tenure_period && ` • Periode: ${position.tenure_period}`}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onEdit}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Edit Jabatan"
                    >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        title="Hapus Jabatan"
                    >
                        <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                </div>
            </div>

            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <h5 className="font-semibold text-gray-700">Anggota ({members.length})</h5>
                    <button
                        onClick={() => onAddMember(position.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg transition-colors"
                    >
                        <Plus className="w-3 h-3" />
                        <span>Tambah</span>
                    </button>
                </div>

                {members.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Belum ada anggota</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {members
                            .sort((a, b) => (a.member_order || 999) - (b.member_order || 999))
                            .map((member) => (
                                <div
                                    key={member.id}
                                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                            {member.photo_url ? (
                                                <Image
                                                    src={member.photo_url}
                                                    alt={member.name}
                                                    width={48}
                                                    height={48}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <User className="w-6 h-6 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 truncate">{member.name}</p>
                                            {member.dusun && (
                                                <p className="text-xs text-gray-600">{member.dusun}</p>
                                            )}
                                            {isCore && member.member_order !== null && (
                                                <p className="text-xs text-gray-500">Urutan: {member.member_order}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <button
                                            onClick={() => onEditMember(member)}
                                            className="flex-1 px-2 py-1 text-xs bg-white hover:bg-gray-100 border border-gray-300 rounded transition-colors"
                                        >
                                            <Edit2 className="w-3 h-3 inline mr-1" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onDeleteMember(member)}
                                            className="flex-1 px-2 py-1 text-xs bg-white hover:bg-red-50 border border-red-300 text-red-600 rounded transition-colors"
                                        >
                                            <Trash2 className="w-3 h-3 inline mr-1" />
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Position Modal
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
        position_name: '',
        position_order: 0,
        tenure_period: '',
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (open) {
            if (mode === 'edit' && position) {
                setFormData({
                    position_name: position.position_name,
                    position_order: position.position_order,
                    tenure_period: position.tenure_period || '',
                });
            } else {
                setFormData({
                    position_name: '',
                    position_order: 0,
                    tenure_period: '',
                });
            }
        }
    }, [open, mode, position]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const data = {
                ...formData,
                is_core: isCore,
                tenure_period: formData.tenure_period || null,
            };

            const result = mode === 'add'
                ? await createStructurePosition(data)
                : await updateStructurePosition(position!.id, data);

            if (result.success) {
                onSuccess();
            } else {
                onError((result as any).message || 'Gagal menyimpan jabatan');
            }
        } catch (err) {
            onError('Terjadi kesalahan');
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
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-xl font-bold text-gray-900">
                            {mode === 'add' ? 'Tambah' : 'Edit'} Jabatan {isCore ? 'Inti' : 'Dusun'}
                        </h3>
                    </div>

                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Nama Jabatan
                            </label>
                            <input
                                type="text"
                                value={formData.position_name}
                                onChange={(e) => setFormData({ ...formData, position_name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Contoh: Ketua, Sekretaris"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Urutan Tampilan
                            </label>
                            <input
                                type="number"
                                value={formData.position_order}
                                onChange={(e) => setFormData({ ...formData, position_order: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                min="0"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Angka lebih kecil akan ditampilkan lebih dulu
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Periode Jabatan (Opsional)
                            </label>
                            <input
                                type="text"
                                value={formData.tenure_period}
                                onChange={(e) => setFormData({ ...formData, tenure_period: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Contoh: 2024-2026"
                            />
                        </div>
                    </div>

                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
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

// Image Cropper Component
function ImageCropper({
    imageUrl,
    onCropComplete,
    onCancel,
}: {
    imageUrl: string;
    onCropComplete: (croppedImage: Blob) => void;
    onCancel: () => void;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const img = new window.Image();
        img.src = imageUrl;
        img.onload = () => {
            setImage(img);
            // Center the image initially
            const canvas = canvasRef.current;
            if (canvas) {
                const size = Math.min(canvas.width, canvas.height);
                const imgSize = Math.min(img.width, img.height);
                const initialScale = size / imgSize;
                setScale(initialScale);
                setPosition({
                    x: (canvas.width - img.width * initialScale) / 2,
                    y: (canvas.height - img.height * initialScale) / 2,
                });
            }
        };
    }, [imageUrl]);

    useEffect(() => {
        if (!image || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw image
        ctx.save();
        ctx.translate(position.x, position.y);
        ctx.scale(scale, scale);
        ctx.drawImage(image, 0, 0);
        ctx.restore();

        // Draw circular mask overlay
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 150, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Draw circle border
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 150, 0, Math.PI * 2);
        ctx.stroke();
    }, [image, scale, position]);

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleCrop = () => {
        if (!canvasRef.current || !image) return;

        const canvas = canvasRef.current;
        const outputCanvas = document.createElement('canvas');
        const outputSize = 300; // Output image size
        outputCanvas.width = outputSize;
        outputCanvas.height = outputSize;

        const ctx = outputCanvas.getContext('2d');
        if (!ctx) return;

        // Calculate crop area in source image coordinates
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 150;

        const sourceX = (centerX - radius - position.x) / scale;
        const sourceY = (centerY - radius - position.y) / scale;
        const sourceSize = (radius * 2) / scale;

        // Draw cropped circular image
        ctx.save();
        ctx.beginPath();
        ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(
            image,
            sourceX,
            sourceY,
            sourceSize,
            sourceSize,
            0,
            0,
            outputSize,
            outputSize
        );
        ctx.restore();

        outputCanvas.toBlob((blob) => {
            if (blob) {
                onCropComplete(blob);
            }
        }, 'image/jpeg', 0.9);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-xl shadow-2xl max-w-2xl w-full"
            >
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900">Crop Foto</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Geser dan zoom untuk menyesuaikan foto dengan border lingkaran
                    </p>
                </div>

                <div className="p-6">
                    <div className="flex justify-center mb-4">
                        <canvas
                            ref={canvasRef}
                            width={400}
                            height={400}
                            className="border-2 border-gray-300 rounded-lg cursor-move"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        />
                    </div>

                    <div className="flex items-center gap-4 justify-center">
                        <button
                            onClick={() => setScale(Math.max(0.1, scale - 0.1))}
                            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            title="Zoom Out"
                        >
                            <ZoomOut className="w-5 h-5" />
                        </button>

                        <input
                            type="range"
                            min="0.1"
                            max="3"
                            step="0.1"
                            value={scale}
                            onChange={(e) => setScale(parseFloat(e.target.value))}
                            className="w-48"
                        />

                        <button
                            onClick={() => setScale(Math.min(3, scale + 0.1))}
                            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            title="Zoom In"
                        >
                            <ZoomIn className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleCrop}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                    >
                        <Check className="w-4 h-4" />
                        <span>Terapkan</span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

// Member Modal
function MemberModal({
    open,
    mode,
    positionId,
    member,
    dusun,
    isCore,
    onClose,
    onSuccess,
    onError,
}: {
    open: boolean;
    mode: "add" | "edit";
    positionId: string;
    member?: StructureMember;
    dusun?: string;
    isCore: boolean;
    onClose: () => void;
    onSuccess: () => void;
    onError: (msg: string) => void;
}) {
    const [formData, setFormData] = useState({
        name: '',
        dusun: '',
        position_role: 'Koordinator',
        member_order: 0,
        bio: '',
        motto: '',
        instagram: '',
        facebook: '',
        linkedin: '',
    });
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [croppedImage, setCroppedImage] = useState<Blob | null>(null);
    const [showCropper, setShowCropper] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            if (mode === 'edit' && member) {
                const socialLinks = member.social_links || {};
                setFormData({
                    name: member.name,
                    dusun: member.dusun || '',
                    position_role: member.position_role || 'Koordinator',
                    member_order: member.member_order || 0,
                    bio: member.bio || '',
                    motto: member.motto || '',
                    instagram: socialLinks.instagram || '',
                    facebook: socialLinks.facebook || '',
                    linkedin: socialLinks.linkedin || '',
                });
                setPhotoPreview(member.photo_url);
            } else {
                setFormData({
                    name: '',
                    dusun: dusun || '',
                    position_role: 'Koordinator',
                    member_order: 0,
                    bio: '',
                    motto: '',
                    instagram: '',
                    facebook: '',
                    linkedin: '',
                });
                setPhotoPreview(null);
            }
            setPhotoFile(null);
            setCroppedImage(null);
        }
    }, [open, mode, member, dusun]);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            onError('File harus berupa gambar');
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            onError('Ukuran file maksimal 2MB');
            return;
        }

        setPhotoFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPhotoPreview(reader.result as string);
            setShowCropper(true);
        };
        reader.readAsDataURL(file);
    };

    const handleCropComplete = (croppedBlob: Blob) => {
        setCroppedImage(croppedBlob);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPhotoPreview(reader.result as string);
        };
        reader.readAsDataURL(croppedBlob);
        setShowCropper(false);
    };

    const uploadPhoto = async (imageBlob: Blob): Promise<string> => {
        const supabase = createClient();
        const fileName = `member-${Date.now()}.jpg`;
        const filePath = `structure-photos/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('public-assets')
            .upload(filePath, imageBlob, {
                contentType: 'image/jpeg',
                upsert: false,
            });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('public-assets')
            .getPublicUrl(filePath);

        return publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            let photoUrl = mode === 'edit' ? member?.photo_url : null;

            if (croppedImage) {
                setUploading(true);
                photoUrl = await uploadPhoto(croppedImage);
                setUploading(false);
            }

            const socialLinks = {
                instagram: formData.instagram || null,
                facebook: formData.facebook || null,
                linkedin: formData.linkedin || null,
            };

            const data = {
                position_id: positionId,
                name: formData.name,
                photo_url: photoUrl,
                dusun: isCore ? null : formData.dusun,
                position_role: isCore ? null : formData.position_role,
                member_order: isCore ? formData.member_order : null,
                bio: formData.bio || null,
                motto: formData.motto || null,
                social_links: socialLinks,
            };

            const result = mode === 'add'
                ? await createStructureMember(data)
                : await updateStructureMember(member!.id, data);

            if (result.success) {
                onSuccess();
            } else {
                onError((result as any).message || 'Gagal menyimpan anggota');
            }
        } catch (err) {
            onError('Terjadi kesalahan');
        } finally {
            setSaving(false);
            setUploading(false);
        }
    };

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8"
                >
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 border-b border-gray-200 bg-white rounded-t-xl sticky top-0 z-10">
                            <h3 className="text-xl font-bold text-gray-900">
                                {mode === 'add' ? 'Tambah' : 'Edit'} Anggota
                            </h3>
                        </div>

                        <div className="p-6 max-h-[calc(100vh-250px)] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    {/* Photo Upload */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Foto Profil
                                        </label>
                                        <div className="flex items-start gap-4">
                                            <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border-4 border-gray-300">
                                                {photoPreview ? (
                                                    <Image
                                                        src={photoPreview}
                                                        alt="Preview"
                                                        width={128}
                                                        height={128}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <User className="w-16 h-16 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handlePhotoChange}
                                                    className="hidden"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors"
                                                >
                                                    <Upload className="w-4 h-4" />
                                                    <span>Pilih Foto</span>
                                                </button>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Format: JPG, PNG. Maksimal 2MB.
                                                    <br />
                                                    Foto akan di-crop menjadi lingkaran.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Nama Lengkap
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="Nama lengkap anggota"
                                            required
                                        />
                                    </div>

                                    {/* Dusun & Role for Dusun */}
                                    {!isCore && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Dusun
                                                </label>
                                                <div className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-lg text-gray-700 font-medium">
                                                    {formData.dusun || dusun || '-'}
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Dusun ditentukan otomatis berdasarkan posisi yang dipilih
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Peran
                                                </label>
                                                <select
                                                    value={formData.position_role}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, position_role: e.target.value })
                                                    }
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                    required
                                                >
                                                    {DUSUN_ROLES.map((role) => (
                                                        <option key={role} value={role}>
                                                            {role}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </>
                                    )}

                                    {/* Member Order */}
                                    {isCore && (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Urutan Tampilan
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.member_order}
                                                onChange={(e) => setFormData({ ...formData, member_order: parseInt(e.target.value) })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                min="0"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Menentukan urutan tampilan anggota dalam satu jabatan. Angka lebih kecil tampil lebih dulu.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    {/* Bio */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Bio Singkat (Opsional)
                                        </label>
                                        <textarea
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="Profil singkat..."
                                            rows={4}
                                            maxLength={300}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formData.bio.length}/300 karakter
                                        </p>
                                    </div>

                                    {/* Motto */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Motto (Opsional)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.motto}
                                            onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="Motto hidup..."
                                            maxLength={200}
                                        />
                                    </div>

                                    {/* Social Links */}
                                    <div className="space-y-3">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Media Sosial (Opsional)
                                        </label>

                                        <input
                                            type="url"
                                            value={formData.instagram}
                                            onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="Instagram URL"
                                        />

                                        <input
                                            type="url"
                                            value={formData.facebook}
                                            onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="Facebook URL"
                                        />

                                        <input
                                            type="url"
                                            value={formData.linkedin}
                                            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="LinkedIn URL"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 bg-white rounded-b-xl sticky bottom-0">
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

            {/* Image Cropper Modal */}
            {showCropper && photoPreview && (
                <ImageCropper
                    imageUrl={photoPreview}
                    onCropComplete={handleCropComplete}
                    onCancel={() => {
                        setShowCropper(false);
                        setPhotoFile(null);
                        setPhotoPreview(mode === 'edit' ? member?.photo_url || null : null);
                    }}
                />
            )}
        </>
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