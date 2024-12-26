'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { safeLocalStorage } from '../../utils/jwt';
import VerifyEmail from './verifyEmail';
import Loading from '../loading/loading';
import toastType from '../../utils/toastify';
import { ToastContainer } from "react-toastify";

const Dashboard = ({ user }) => {

  if (!user) {
    return <div>Loading...</div>;
  }

  const [adminRequests, setAdminRequests] = useState();
  const [referals, setReferals] = useState();
  const [loading, setLoading] = useState(false);
  const [reqSending, setReqSending] = useState(false);
  const [requestStatus, setRequestStatus] = useState('Not Sent');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [adminApproveActionLoading, setAdminApproveActionLoading] = useState(false);
  const [adminDenyActionLoading, setAdminDenyActionLoading] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [emailFilter, setEmailFilter] = useState('');

  const checkAdminApprovalStatus = async () => {
    if (user?.isAdmin) {
      return;
    }
    else {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_PATH}/admin/adminRequestStatus`, {
          headers: {
            Authorization: safeLocalStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        })
        console.log(res.data);
        if (res.data?.message) {
          //toastType(res.data.message, 'success');
          setRequestStatus(res.data.message);
        }
      }
      catch (err) {
        // toastType('You are a user', 'error');
        setRequestStatus('Not Sent');
        console.log(err);
      }
    }
  }

  const handleRequestAdmin = async () => {
    try {
      setReqSending(true);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_PATH}/admin/adminRequestCreate`, {
        userId: user.id
      }, {
        headers: {
          Authorization: safeLocalStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      })
      //alert(res.data?.message);
      if (res.data?.message) {
        toastType(res.data.message, 'success');
        setRequestStatus('requested');
      }
    }
    catch (err) {
      toastType('Internal server error', 'error');
      console.log(err);
    }
    finally {
      setReqSending(false);
    }
  };

  const handleAdminAction = async (email, action) => {
    if (action === 'approved') {
      try {
        setAdminApproveActionLoading(true);
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_PATH}/admin/adminRequestApproval`, {
          email
        }, {
          headers: {
            Authorization: safeLocalStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        })
        if (res.status === 200) {
          toastType(res.data?.message, 'success');
          setAdminRequests(adminRequests.filter((req) => req.user.email !== email));
        }

      }
      catch (err) {
        toastType('Internal server error', 'error');
        console.log(err);
      }
      finally {
        setAdminApproveActionLoading(false);
      }
    }
    else {
      try {
        setAdminDenyActionLoading(true);
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_PATH}/admin/adminRequestDenial`, {
          email
        }, {
          headers: {
            Authorization: safeLocalStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        })
        if (res.status === 200) {
          toastType(res.data?.message, 'success');
          setAdminRequests(adminRequests.filter((req) => req.user.email !== email));
        }
      }
      catch (err) {
        toastType('Internal server error', 'error');
        console.log(err);
      }
      finally {
        setAdminDenyActionLoading(false);
      }
    }
  };

  const getReferrals = async () => {
    if (user?.isAdmin) {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_PATH}/referal/getAllReferals`, {
          headers: {
            Authorization: safeLocalStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        });
        setReferals(res.data);
        console.log(res.data);
      } catch (error) {
        toastType('Internal server error', 'error');
        console.log(error);
      }
      finally {
        setLoading(false);
      }
    }
    else {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_PATH}/referal/getAllReferals`, {
          headers: {
            Authorization: safeLocalStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        });
        setReferals(res.data);
        console.log(res.data);
      } catch (error) {
        toastType('Internal server error', 'error');
        console.log(error);
      }
      finally {
        setLoading(false)
      }
    }
  };

  const getAllAdminRequest = async () => {
    if (user?.isAdmin) {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_PATH}/admin/getAllAdminRequest`, {
          headers: {
            Authorization: safeLocalStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        })
        console.log(res.data);
        setAdminRequests(res.data);
      }
      catch (err) {
        toastType('Internal server error', 'error');
        console.log(err);
      }
    }
    else {
      return;
    }
  }

  useEffect(() => {
    getReferrals();
    getAllAdminRequest();
  }, [])

  useEffect(() => {
    checkAdminApprovalStatus();
  }, [requestStatus])

  // Filter the referrals based on the selected status and email
  const filteredReferrals = referals?.filter((ref) => {
    const statusMatch = statusFilter === 'all' || ref.status === statusFilter;
    const emailMatch = user?.isAdmin ? (ref.referee.email.includes(emailFilter) || ref.referrer.email.includes(emailFilter)) : ref.referee.email.includes(emailFilter);
    return statusMatch && emailMatch;
  })


  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <ToastContainer />
      {!user?.isAdmin && user?.referedCode && !user?.isVerified && <VerifyEmail user={user} />}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-gray-800 p-4 rounded-lg shadow-lg shadow-gray-500">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <h1 className="text-lg font-semibold text-white">{user.email}</h1>
          <p className="text-md text-gray-400">Referral Code: {user.referalCode}</p>
          <p className="text-md font-semibold text-white">Points: {user?.points}</p>
        </div>

        {!user.isAdmin && (
          <button
            onClick={handleRequestAdmin}
            disabled={requestStatus === 'pending'}
            className={`py-2 px-4 font-semibold rounded-lg text-white ${requestStatus === 'pending'
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
              }`}
          >
            {reqSending ? (
              <Loading />
            ) : requestStatus === 'pending' ? (
              'Request Sent'
            ) : requestStatus === 'denied' ? (
              'Denied | ReRequest'
            ) : (
              'Request to Become Admin'
            )}
          </button>
        )}
      </div>


      {/* Filter Section */}
      <div className="flex space-x-4 mb-4">
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 text-black border rounded"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <input
            type="text"
            placeholder="Search by Email"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
            className="p-2 text-black border rounded"
          />
        </div>
      </div>

      {filteredReferrals?.length > 0 ? (
        <div className="w-11/12 mx-auto h-fit bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            {user.isAdmin ? 'Referral Management' : 'Your Referrals'}
          </h2>
          <div className="space-y-2">
            <div className='w-full flex border-b'>
              <div className='text-black w-1/2'>{user?.isAdmin ? "Referee Email" : "Email"}</div>
              {user?.isAdmin && <div className='text-black w-1/2'>Referrer Email</div>}
              <div className='text-black w-1/2'>Status</div>
            </div>
            {filteredReferrals.map((referal, index) => (
              <div key={index} className="flex w-full items-center border-b py-2">
                <div className='w-1/2'>
                  <span className="text-gray-600">{referal?.referee.email}</span>
                </div>
                {user?.isAdmin && (
                  <div className='w-1/2'>
                    <span className="text-gray-600">{referal?.referrer.email}</span>
                  </div>
                )}
                <div className='w-1/2'>
                  <span className="text-gray-600">{referal?.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className='text-gray-600 w-full text-center'>No Referrals Found</div>
      )}

      {user.isAdmin && (
        <div className="fixed top-10 right-10">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg"
          >
            {isSidebarOpen ? 'Close Requests' : 'View Requests'}
          </button>
          {isSidebarOpen && (
            <div className="absolute top-12 overflow-y-scroll right-0 w-64 bg-white shadow-lg p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Admin Requests
              </h3>
              {adminRequests.map((req) => (
                <div key={req.user.email} className="mb-4">
                  <p className="text-gray-700 mb-2">{req.user.email}</p>
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleAdminAction(req.user.email, 'approved')}
                      className="text-green-500 hover:underline"
                      disabled={adminApproveActionLoading}
                    >
                      {adminApproveActionLoading ? <Loading /> : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleAdminAction(req.user.email, 'denied')}
                      className="text-red-500 hover:underline"
                      disabled={adminDenyActionLoading}
                    >
                      {adminDenyActionLoading ? <Loading /> : 'Deny'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default Dashboard;
