import React from 'react';
import { Link } from 'react-router-dom';
import johnDoeImg from '../assets/john_doe.jpg';
import janeSmithImg from '../assets/jane_smith.jpg';
import mikeJohnsonImg from '../assets/mike_johnson.jpg';

const staffMembers = [
  {
    name: 'John Doe',
    position: 'Manager',
    experience: '15+ years in automotive management',
    specialty: 'Customer service & business operations',
    certification: 'Certified Automotive Service Manager',
    photo: johnDoeImg,
    department: 'Management',
  },
  {
    name: 'Jane Smith',
    position: 'Lead Mechanic',
    experience: '10+ years in vehicle repair',
    specialty: 'Engine diagnostics & brake systems',
    certification: 'ASE Certified Technician',
    photo: janeSmithImg,
    department: 'Mechanics',
  },
  {
    name: 'Mike Johnson',
    position: 'Sales Representative',
    experience: '5+ years in automotive sales',
    specialty: 'Spare parts & customer support',
    certification: 'Certified Auto Parts Specialist',
    photo: mikeJohnsonImg,
    department: 'Sales',
  },
];

const StaffPage = () => {
  return (
    <div className="relative px-6 py-10">
      <h1 className="text-center text-3xl font-bold text-gray-900">Meet Our Staff</h1>
      <p className="text-center text-gray-500 mb-10">
        Our team of experts is here to help with all your vehicle needs.
      </p>

      {/* Staff Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {staffMembers.map((member, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md text-center"
          >
            <img
              src={member.photo}
              alt={member.name}
              className="w-24 h-24 mx-auto rounded-full object-cover"
            />
            <h3 className="mt-4 text-xl font-semibold text-gray-800">
              {member.name}
            </h3>
            <p className="text-green-600 font-medium">{member.position}</p>
            <p className="text-sm text-gray-600">{member.experience}</p>
            <p className="text-sm text-emerald-700 font-semibold">
              {member.specialty}
            </p>
            <p className="text-sm text-blue-600">{member.certification}</p>
          </div>
        ))}
      </div>

      {/* Staff Login Button */}
      <Link
        to="/login"
        className="fixed right-6 bottom-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-5 rounded-lg shadow-lg transition duration-300 no-underline hover:no-underline"
        style={{ textDecoration: 'none' }}
      >
        Staff Login
      </Link>
    </div>
  );
};

export default StaffPage;
