import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { eventsApi } from '../api/services';

interface SectionInput { name: string; rows: string; seatsPerRow: number; price: number; }
interface FormData {
  title: string; description: string; category: string;
  date: string; endDate: string;
  venueName: string; venueAddress: string; venueCity: string; venueState: string; venueCountry: string; venueCapacity: number;
  tags: string;
  sections: SectionInput[];
}

export const CreateEventPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: {
      sections: [{ name: 'General', rows: 'A,B,C,D,E', seatsPerRow: 10, price: 500 }],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'sections' });

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        title: data.title,
        description: data.description,
        category: data.category,
        date: data.date,
        endDate: data.endDate,
        venue: {
          name: data.venueName,
          address: data.venueAddress,
          city: data.venueCity,
          state: data.venueState,
          country: data.venueCountry,
          capacity: Number(data.venueCapacity),
        },
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        seatingLayout: {
          sections: data.sections.map((s) => ({
            name: s.name,
            rows: s.rows.split(',').map((r) => r.trim()).filter(Boolean),
            seatsPerRow: Number(s.seatsPerRow),
            price: Number(s.price),
          })),
        },
      };

      const { data: res } = await eventsApi.create(payload);
      const eventId = res.data!._id;

      // Auto-publish
      await eventsApi.publish(eventId);
      toast.success('Event created and published!');
      navigate(`/events/${eventId}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create event');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display font-bold text-3xl text-white mb-8">Create Event</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <div className="card p-6 space-y-5">
          <h2 className="font-display font-semibold text-xl text-white">Event Details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
            <input {...register('title', { required: true })} className="input" placeholder="e.g. Summer Music Festival 2025" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
            <textarea {...register('description', { required: true })} rows={4} className="input resize-none" placeholder="Tell attendees about your event..." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
              <select {...register('category', { required: true })} className="input">
                {['music','sports','tech','art','food','comedy','theatre','other'].map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Start Date & Time *</label>
              <input {...register('date', { required: true })} type="datetime-local" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">End Date & Time *</label>
              <input {...register('endDate', { required: true })} type="datetime-local" className="input" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma-separated)</label>
            <input {...register('tags')} className="input" placeholder="jazz, outdoor, family-friendly" />
          </div>
        </div>

        {/* Venue */}
        <div className="card p-6 space-y-5">
          <h2 className="font-display font-semibold text-xl text-white">Venue</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Venue Name *</label>
              <input {...register('venueName', { required: true })} className="input" placeholder="e.g. NESCO Exhibition Centre" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Address *</label>
              <input {...register('venueAddress', { required: true })} className="input" placeholder="Street address" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">City *</label>
              <input {...register('venueCity', { required: true })} className="input" placeholder="Mumbai" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">State *</label>
              <input {...register('venueState', { required: true })} className="input" placeholder="Maharashtra" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Country *</label>
              <input {...register('venueCountry', { required: true })} className="input" placeholder="India" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Capacity *</label>
              <input {...register('venueCapacity', { required: true })} type="number" className="input" placeholder="5000" />
            </div>
          </div>
        </div>

        {/* Seating */}
        <div className="card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-xl text-white">Seating Sections</h2>
            <button
              type="button"
              onClick={() => append({ name: '', rows: 'A,B', seatsPerRow: 10, price: 500 })}
              className="btn-ghost flex items-center gap-1 text-sm"
            >
              <Plus className="w-4 h-4" /> Add Section
            </button>
          </div>

          {fields.map((field, idx) => (
            <div key={field.id} className="bg-gray-800 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300">Section {idx + 1}</span>
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(idx)} className="text-red-400 hover:text-red-300 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Name</label>
                  <input {...register(`sections.${idx}.name`, { required: true })} className="input py-2" placeholder="VIP" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Rows (comma-sep)</label>
                  <input {...register(`sections.${idx}.rows`, { required: true })} className="input py-2" placeholder="A,B,C" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Seats/Row</label>
                  <input {...register(`sections.${idx}.seatsPerRow`, { required: true })} type="number" className="input py-2" placeholder="10" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Price (₹)</label>
                  <input {...register(`sections.${idx}.price`, { required: true })} type="number" className="input py-2" placeholder="500" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? 'Creating Event...' : 'Create & Publish Event'}
        </button>
      </form>
    </div>
  );
};
