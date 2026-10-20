"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, MapPin, Check, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface AddressManagerProps {
  initialAddresses: Address[];
}

export default function AddressManager({ initialAddresses }: AddressManagerProps) {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const openAddModal = () => {
    setEditingId(null);
    setFullName("");
    setPhone("");
    setStreet("");
    setCity("");
    setStateName("");
    setPincode("");
    setIsDefault(addresses.length === 0);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingId(addr.id);
    setFullName(addr.fullName);
    setPhone(addr.phone);
    setStreet(addr.street);
    setCity(addr.city);
    setStateName(addr.state);
    setPincode(addr.pincode);
    setIsDefault(addr.isDefault);
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      fullName,
      phone,
      street,
      city,
      state: stateName,
      pincode,
      isDefault,
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/account/addresses/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update address");

        setAddresses((prev) =>
          prev.map((a) => {
            if (a.id === editingId) return data.address;
            if (isDefault) return { ...a, isDefault: false };
            return a;
          })
        );
      } else {
        const res = await fetch("/api/account/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to add address");

        setAddresses((prev) => [
          ...(isDefault ? prev.map((a) => ({ ...a, isDefault: false })) : prev),
          data.address,
        ]);
      }

      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this delivery address?")) return;
    try {
      const res = await fetch(`/api/account/addresses/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete address");
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      router.refresh();
    } catch {
      alert("Could not remove address");
    }
  };

  return (
    <div>
      <div className="flex items-baseline justify-between mb-6 pb-2 border-b border-[#E5E0D8]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C29B38] block mb-0.5">
            Logistics &amp; Delivery Destination
          </span>
          <h2
            style={{ fontFamily: "var(--font-editorial)" }}
            className="text-3xl font-normal tracking-wide"
          >
            Saved Delivery Addresses
          </h2>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#111111] text-[#FAF8F5] text-xs font-mono uppercase tracking-wider hover:bg-[#333333] transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Address</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Address Dashed Card (Amazon Style) */}
        <button
          onClick={openAddModal}
          className="bg-white border-2 border-dashed border-[#D5D0C8] hover:border-[#111111] p-6 flex flex-col items-center justify-center text-center min-h-[180px] transition-colors group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center mb-3 group-hover:bg-[#111111] group-hover:text-white transition-colors">
            <Plus className="w-5 h-5 stroke-[1.5]" />
          </div>
          <span
            style={{ fontFamily: "var(--font-editorial)" }}
            className="text-xl tracking-wide font-normal mb-1"
          >
            Add Address (नया पता जोड़ें)
          </span>
          <p className="text-xs text-[#888] font-mono">
            Speed up checkout for home or gifting
          </p>
        </button>

        {/* Existing Address Cards */}
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`bg-white border p-6 relative flex flex-col justify-between shadow-sm transition-all ${
              addr.isDefault ? "border-[#111111] ring-1 ring-[#111111]" : "border-[#E5E0D8]"
            }`}
          >
            {addr.isDefault && (
              <span className="absolute top-4 right-4 text-[9px] font-mono uppercase tracking-widest bg-[#111] text-white px-2 py-0.5 font-medium">
                Default Destination
              </span>
            )}

            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-[#C29B38]" />
                <h3 className="text-sm font-semibold text-[#111]">{addr.fullName}</h3>
              </div>
              <p className="text-xs text-[#555] leading-relaxed mb-1">
                {addr.street}
              </p>
              <p className="text-xs text-[#555] leading-relaxed">
                {addr.city}, {addr.state} - <span className="font-mono font-medium text-[#111]">{addr.pincode}</span>
              </p>
              <p className="text-xs text-[#777] font-mono mt-3">
                Phone: <span className="text-[#111] font-medium">{addr.phone}</span>
              </p>
            </div>

            {/* Action Bar: Edit, Delete, Set Default */}
            <div className="flex items-center gap-4 pt-4 mt-4 border-t border-[#F0ECE6] text-xs font-mono">
              <button
                onClick={() => openEditModal(addr)}
                className="text-[#111] hover:underline flex items-center gap-1 uppercase tracking-wider text-[11px]"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
              <span className="text-[#DDD]">|</span>
              <button
                onClick={() => handleDelete(addr.id)}
                className="text-rose-600 hover:underline flex items-center gap-1 uppercase tracking-wider text-[11px]"
              >
                <Trash2 className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Luxury Modal for Add/Edit Address */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FAF8F5] border border-[#E5E0D8] max-w-lg w-full p-8 shadow-2xl relative text-[#111]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-[#888] hover:text-[#111] transition-colors"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>

            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C29B38] block mb-1">
              Deeta Concierge • पता विवरण
            </span>
            <h3
              style={{ fontFamily: "var(--font-editorial)" }}
              className="text-2xl font-normal tracking-wide mb-6"
            >
              {editingId ? "Edit Delivery Address" : "Add Delivery Address"}
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#666] mb-1">
                  Full Name (पूरा नाम) *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Vivek Chandra"
                  className="w-full bg-white border border-[#E5E0D8] p-2.5 text-xs focus:border-[#111] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#666] mb-1">
                  Mobile Number for Delivery Updates (मोबाइल नंबर) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full bg-white border border-[#E5E0D8] p-2.5 text-xs font-mono focus:border-[#111] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#666] mb-1">
                  Flat, House no., Building, Street (गली, मोहल्ला या मकान नंबर) *
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. Station Road, Near Post Office"
                  className="w-full bg-white border border-[#E5E0D8] p-2.5 text-xs focus:border-[#111] outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#666] mb-1">
                    City (शहर) *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Bakhtiarpur"
                    className="w-full bg-white border border-[#E5E0D8] p-2.5 text-xs focus:border-[#111] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#666] mb-1">
                    State (राज्य) *
                  </label>
                  <input
                    type="text"
                    required
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="e.g. Bihar"
                    className="w-full bg-white border border-[#E5E0D8] p-2.5 text-xs focus:border-[#111] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#666] mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g. 803212"
                    className="w-full bg-white border border-[#E5E0D8] p-2.5 text-xs font-mono focus:border-[#111] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isDefaultCheck"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="w-4 h-4 accent-[#111]"
                />
                <label htmlFor="isDefaultCheck" className="text-xs text-[#555] cursor-pointer">
                  Use this as my default delivery address for all orders
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E0D8]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#E5E0D8] text-xs font-mono uppercase tracking-wider hover:bg-black/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-[#111111] text-[#FAF8F5] text-xs font-mono uppercase tracking-wider hover:bg-[#333333] transition-colors flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingId ? "Update Address" : "Save Address"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
