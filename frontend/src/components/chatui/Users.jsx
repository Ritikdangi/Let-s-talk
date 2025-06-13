import React, { useMemo } from 'react'
import User from './User'
import { useGetAllUsers } from '../../context/useGetAllUsers'
import { useSearch } from '../../context/SearchContext'

function Users() {
  const [users, setUsers] = useGetAllUsers();
  const { debouncedSearch } = useSearch();

  // Show loading state if users is undefined
  if (!users) {
    return <div className='px-5 py-2 flex justify-center items-center h-[calc(88vh-10vh)] text-white font-semibold'>Loading...</div>;
  }

  const filteredUsers = useMemo(() => {
    // Default case: Show all users when no search query
    if (!debouncedSearch.trim()) {
      return users;
    }
    
    // Search case: Filter users based on search
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    return filtered;
  }, [users, debouncedSearch]);

  return (
    <div className='px-5 py-2 text-white font-semibold'>
      <h1 className='bg-slate-500 p-2 rounded-md'>
        Messages 
      </h1>
      <div className='overflow-y-auto h-[calc(88vh-10vh)] scrollbar-hide'>
        {debouncedSearch.trim() && filteredUsers.length === 0 ? (
          // Show "Not found" only when there's a search query and no results
          <div className="p-4 text-center text-gray-400">
            No users found
          </div>
        ) : (
          // Show users (either all users or filtered results)
          filteredUsers.map(user => (
            <User key={user._id} userData={user} />
          ))
        )}
      </div>
    </div>
  );
}

export default Users

