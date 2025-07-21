import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PublicEvents from './pages/PublicEvents';
import Committees from './pages/Committees';
import Donate from './pages/Donate';
import MatrimonyRegistration from './pages/Matrimony_registration';
import UserRegistration from './pages/UserRegistration';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import PrivacyPolicy from './pages/Privacy';
import TermsAndConditions from './pages/Terms';
import VolunteerHours from './pages/VolunteerHours';
import AddVolunteerHours from './pages/AddVolunteerHours';
import UserTaxDocs from './pages/UserTaxDocs';
import FamilyList from './pages/FamilyList';
import EditFamilyMember from './pages/EditFamilyMember';
import UserPayments from './pages/UserPayments';
import SubmitBill from './pages/SubmitBill';
import MatrimonyProfiles from './pages/MatrimonyProfiles';
import UserEvents from './pages/UserEvents';
import EventRegistration from './pages/EventRegistration';
import CreateEvent from './pages/CreateEvent';
import ManageEvents from './pages/ManageEvent';
import EditEvent from './pages/EditEvent';
import ManageTasks from './pages/ManageTasks';
import CreateTask from './pages/CreateTask';
import EditTask from './pages/EditTask';
import ManageSubtasks from './pages/ManageSubtasks';
import CreateSubtask from './pages/CreateSubtask';
import EditSubtask from './pages/EditSubtask';
import RegistrationSummary from './pages/RegistrationsSummary';
import EventRegistrations from './pages/EventRegistrations';
import AdminReports from './pages/AdminReports';
import MatrimonyApproval from './pages/MatrimonyApproval';
import MatrimonyProfile from './pages/MatrimonyProfile';
import UserRoleManagement from './pages/UserRoleManagement';
import AdminUserApproval from './pages/AdminUserApproval';
import NotificationTemplateManagement from './pages/NotificationTemplateManagement';
import EditNotificationTemplate from './pages/EditNotificationTemplate';
import NotificationScheduleManagement from './pages/NotificationScheduleManagement';
import EditNotificationSchedule from './pages/EditNotificationSchedule';
import NotificationCenter from './pages/NotificationCenter';
import BecomeMember from './pages/BecomeMember';
import { AuthContext } from './context/AuthContext';
import AutoLogout from './components/AutoLogout';
import { useContext } from 'react';
import Navbar from './components/Navbar';


function App() {
  //useAutoLogout();
  const { logout } = useContext(AuthContext);

  return (
     
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/public-events" element={<PublicEvents />} />
        <Route path="/committees" element={<Committees />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/matrimony_reg" element={<MatrimonyRegistration />} />
        <Route path="/register" element={<UserRegistration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
       
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['user','admin', 'superAdmin']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superAdmin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superAdmin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/create-event"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superAdmin']}>
              <CreateEvent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/tasks"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superAdmin']}>
              <ManageTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-tasks"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superAdmin']}>
              <ManageTasks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/manage-events"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superAdmin']}>
              <ManageEvents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-task"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superAdmin']}>
              <CreateTask />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-subtasks/:taskId"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superAdmin']}>
              <ManageSubtasks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/matrimony-profile/:id"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin', 'superAdmin']}>
              <MatrimonyProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-subtask"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superAdmin']}>
              <CreateSubtask />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superAdmin']}>
              <AdminReports />
            </ProtectedRoute>
          }
        />


        <Route
          path="/edit-event/:id"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superAdmin']}>
              <EditEvent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/registrations"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superAdmin']}>
              <RegistrationSummary />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-task/:id"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superAdmin']}>
              <EditTask />
            </ProtectedRoute>
          }
        />

        <Route path="/edit-subtask/:id" element={
          <ProtectedRoute allowedRoles={['admin', 'superAdmin']}>
            <EditSubtask />
          </ProtectedRoute>
        } />

        <Route
          path="/volunteer-hours"
          element={
            <ProtectedRoute allowedRoles={['user','admin', 'superAdmin']}>
              <VolunteerHours />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteer-hours/add/:memberId"
          element={
            <ProtectedRoute allowedRoles={['user','admin', 'superAdmin']}>
              <AddVolunteerHours />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-tax-docs"
          element={
            <ProtectedRoute allowedRoles={['user','admin', 'superAdmin']}>
              <UserTaxDocs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-family"
          element={
            <ProtectedRoute allowedRoles={['user','admin', 'superAdmin']}>
              <FamilyList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-family/edit/:id"
          element={
            <ProtectedRoute allowedRoles={['user','admin', 'superAdmin']}>
              <EditFamilyMember />
            </ProtectedRoute>
          }
        />

        <Route path="/event-registrations/:eventId"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superAdmin']}>
              <EventRegistrations />
            </ProtectedRoute>
          }
        />

        <Route path="/matrimony-approval"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superAdmin']}>
              <MatrimonyApproval />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-payments"
          element={
            <ProtectedRoute allowedRoles={['user','admin', 'superAdmin']}>
              <UserPayments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/submit-bill"
          element={
            <ProtectedRoute allowedRoles={['user','admin', 'superAdmin']}>
              <SubmitBill />
            </ProtectedRoute>
          }
        />

        <Route
          path="/matrimony-profiles"
          element={
            <ProtectedRoute allowedRoles={['user','admin', 'superAdmin']}>
              <MatrimonyProfiles />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-events"
          element={
            <ProtectedRoute allowedRoles={['user','admin', 'superAdmin']}>
              <UserEvents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/event-registration/:id"
          element={
            <ProtectedRoute allowedRoles={['user','admin', 'superAdmin']}>
              <EventRegistration />
            </ProtectedRoute>
          }
        />

        <Route
          path="/membership-upgrade"
          element={
            <ProtectedRoute allowedRoles={['user','admin', 'superAdmin']}>
              <BecomeMember />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/user-roles"
          element={
            <ProtectedRoute allowedRoles={['superAdmin']}>
              <UserRoleManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/approvals"
          element={
            <ProtectedRoute allowedRoles={['superAdmin']}>
              <AdminUserApproval />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/notification-management"
          element={
            <ProtectedRoute allowedRoles={['superAdmin']}>
              <NotificationTemplateManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-notification-template/:id"
          element={
            <ProtectedRoute allowedRoles={['superAdmin']}>
              <EditNotificationTemplate />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notification-schedule"
          element={
            <ProtectedRoute allowedRoles={['superAdmin']}>
              <NotificationScheduleManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-notification-schedule/:id"
          element={
            <ProtectedRoute allowedRoles={['superAdmin']}>
              <EditNotificationSchedule />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notification-center"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin', 'superAdmin']}>
              <NotificationCenter />
            </ProtectedRoute>
          }
        />
      </Routes>
  );
}

export default App;
