// 'use client';

// import { useEffect, useState, FormEvent } from 'react';
// // import { getUserById, updateUser } from '@/lib/userService';
// // import { User } from '@/types';
// import toast from 'react-hot-toast';
// import { ArrowLeft, Loader2 } from 'lucide-react';

// interface UserEditProp {
//   userId: string;
//   onBack: () => void;
//   onSuccess: () => void;
// }

// export default function UserEdit({ userId, onBack, onSuccess }: UserEditProp) {
//   const [formData, setFormData] = useState({ name: '', email: '', phoneNumber: '', role: '' });
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         setLoading(true);
//         const user = await getUserById(userId);
//         setFormData({
//           name: user.name,
//           email: user.email,
//           phoneNumber: user.phoneNumber,
//           role: user.role,
//         });
//       } catch (err) {
//         setError('Failed to load user data.');
//         toast.error('Failed to load user data.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, [userId]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       await updateUser(userId, formData);
//       toast.success('User updated successfully!');
//       onSuccess(); // This will trigger the parent to go back to the list
//     } catch (err) {
//       toast.error('Failed to update user. Please try again.');
//       console.error(err);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return <div>Loading form...</div>;
//   if (error) return <div className="text-red-500">{error}</div>;

//   return (
//     <div className="bg-white p-6 shadow-md rounded-lg">
//       <button onClick={onBack} className="flex items-center mb-6 text-sm text-blue-600 hover:underline">
//         <ArrowLeft size={16} className="mr-1" />
//         Back to Users List
//       </button>
//       <h2 className="text-2xl font-bold mb-4">Edit User</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
//             <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
//           </div>
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
//             <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
//           </div>
//           <div>
//             <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
//             <input type="tel" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
//           </div>
//           <div>
//             <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
//             <input type="text" name="role" id="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
//           </div>
//         </div>
//         <div className="mt-6 flex justify-end">
//           <button type="button" onClick={onBack} className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50">
//             Cancel
//           </button>
//           <button type="submit" disabled={submitting} className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md border border-transparent hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
//             {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//             {submitting ? 'Saving...' : 'Save Changes'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }