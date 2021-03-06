/*!

=========================================================
* Black Dashboard PRO React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "./views/Dashboard.jsx";
import Login from "./views/pages/Login.jsx";
import CreateAppointment from "./views/pages/CreateAppointment.jsx"
import Sources from "./views/pages/Sources.jsx"
import Scenarios from "./views/pages/Scenarios.jsx"
import Teams from "./views/pages/Teams.jsx"
import Assistance from "./views/pages/Assistance.jsx"
import ApproveAssistance from "./views/pages/ApproveAssistance.jsx"
import RejectedAssistance from "./views/pages/RejectedAssistance.jsx"
import AppointmentHistory from "./views/pages/AppointmentHistory.jsx"
import DealershipHistoryNew from "./views/pages/DealershipHistoryNew.jsx"
import FailedTexts from "./views/pages/FailedTexts.jsx"
import AppointmentSearchNew from "./views/pages/AppointmentSearchNew.jsx"
import DealershipManagement from "./views/pages/DealershipManagement.jsx"
import UserManagement from "./views/pages/UserManagement.jsx"
import DealershipLogin from "./views/pages/DealershipLogin.jsx"
import DealershipDashboard from "./views/DealershipDashboard.jsx"
import DealershipUsers from "./views/pages/DealershipUsers.jsx"
import AdminDashboard from "./views/AdminDashboard.jsx"
import DealershipPerformance from "./views/pages/DealershipPerformance.jsx"
import DealershipPerformanceTiers from "./views/pages/DealershipPerformanceTiers.jsx"
import Reports from "./views/pages/Reports.jsx"
import AdminReports from "./views/pages/AdminReports.jsx"
import ServiceDashboard from "./views/ServiceDashboard.jsx"
import ServiceTVDashboard from "./views/pages/ServicceTVDashboard.jsx"
import SalesTVDashboard from "./views/pages/SalesTVDashboard.jsx"
import CustomerSearch from "./views/pages/CustomerSearch.jsx"
import DealershipProfile from "./views/pages/DealershipProfile.jsx"
import AgentProfile from "./views/pages/AgentProfile.jsx"
import Leads from "./views/pages/Leads.jsx"
import PaymentCalculator from "./views/pages/PaymentCalculator.jsx"
import MojoDealershipProfile from "./views/pages/MojoDealershipProfile.jsx"
import Justin from "./views/pages/Justin.jsx"
import TeamStandings from "./views/pages/TeamStandings.jsx"
import GoalDashboard from "./views/pages/GoalDashboard.jsx"
import Times from "./views/pages/Times.jsx"
import Rooftop from "./views/pages/Rooftop.jsx"
import NewApp from "./views/pages/NewApp.jsx"
// import CentralAI from "./views/pages/CentralAI.jsx"
const routes = [
  {
    path: "/agent_profile",
    name: "Profile",
    icon: "tim-icons icon-badge",
    component: AgentProfile,
    layout: "/admin"
  },
  {
    path: "/pay_plan_calculator",
    name: "Pay Plan Calculator",
    icon: "tim-icons icon-money-coins",
    component: PaymentCalculator,
    layout: "/admin"
  },
  // {
  //   path: "/new_app",
  //   name: "App 2.0",
  //   icon: "tim-icons icon-money-coins",
  //   component: NewApp,
  //   layout: "/admin"
  // },
  // {
  //   name: "Central AI",
  //   path: "/central_ai",
  //   icon: "tim-icons icon-send",
  //   component: CentralAI,
  //   layout: "/admin",
  //   adminOnly: true
  // },

  {
    name: "Rooftop",
    path: "/rooftop",
    icon: "tim-icons icon-send",
    component: Rooftop,
    layout: "/admin",
    adminOnly: true
  },
  {
    collapse: true,
    name: "Sales Dashboards",
    // rtlName: "صفحات",
    icon: "tim-icons icon-badge",
    state: "salesDashboardCollapse",
    views: [
      {
        path: "/dashboard",
        name: "Sales Dashboard",
        rtlName: "لوحة القيادة",
        icon: "tim-icons icon-chart-pie-36",
        component: Dashboard,
        layout: "/admin"
      },
      {
        path: "/goal_dashboard",
        name: "Goal Dashbaord",
        icon: "tim-icons icon-bullet-list-67",
        adminOnly: true,
        component: GoalDashboard,
        layout: "/admin"
      },
      {
        path: "/team_standings",
        name: "Team Standings",
        icon: "tim-icons icon-chart-bar-32",
        component: TeamStandings,
        layout: "/admin"
      },
      {
        path: "/admin_dashboard",
        name: "Admin Dashboard",
        icon: "tim-icons icon-chart-pie-36",
        component: AdminDashboard,
        adminOnly: true,
        layout: "/admin"
      },
      {
        path: "/daily_dealership_goals",
        name: "Daily Dealer Goals",
        component: DealershipPerformance,
        layout: "/admin",
        adminOnly: true,
        icon: "tim-icons icon-notes"
      },
      {
        path: "/goal_tiers",
        name: "Goal Tiers",
        component: DealershipPerformanceTiers,
        layout: "/admin",
        adminOnly: true,
        icon: "tim-icons icon-notes"
      },
      {
        path: "/sales_tv_dashboard",
        name: "Sales TV Dashboard",
        icon: "tim-icons icon-tv-2",
        component: SalesTVDashboard,
        adminOnly: true,
        //need to remove adminOnly when it's done
        layout: "/admin"
      },
      {
        path: "/reports",
        name: "Reports",
        icon: "tim-icons icon-bullet-list-67",
        adminOnly: true,
        component: AdminReports,
        layout: "/admin"
      },

    ]
  },
  {
    collapse: true,
    name: "Service Dashboards",
    // rtlName: "صفحات",
    icon: "tim-icons icon-badge",
    state: "serviceDashboardCollapse",
    views: [
      {
        path: "/service_dashboard",
        name: "Service Dashboard",
        rtlName: "لوحة القيادة",
        icon: "tim-icons icon-chart-pie-36",
        component: ServiceDashboard,
        layout: "/admin"
      },
      {
        path: "/service_tv_dashboard",
        name: "Service TV Dashboard",
        rtlName: "لوحة القيادة",
        icon: "tim-icons icon-tv-2",
        component: ServiceTVDashboard,
        layout: "/admin"
      },
    ]
  },
  {
    path: "/dashboard",
    name: "Dealership Dashboard",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-chart-pie-36",
    component: DealershipDashboard,
    layout: "/dealership"
  },
  {
    path: "/customer_search",
    name: "Customer Search",
    icon: "tim-icons icon-light-3",
    component: CustomerSearch,
    layout: "/dealership"
  },
  {
    path: "/reports",
    name: "Reports",
    icon: "tim-icons icon-bullet-list-67",
    component: Reports,
    layout: "/dealership"
  },
  {
    path: "/profile",
    name: "Profile",
    icon: "tim-icons icon-badge",
    component: DealershipProfile,
    layout: "/dealership"
  },
  {
    path: "/dealership_profile",
    name: "MOJO - Dealership Profile",
    icon: "tim-icons icon-badge",
    component: MojoDealershipProfile,
    layout: "/auth"
  },
  {
    path: "/justin",
    name: "Justin",
    icon: "tim-icons icon-badge",
    component: Justin,
    layout: "/auth"
  },
  {
    path: "/times",
    name: "Times",
    icon: "tim-icons icon-badge",
    component: Times,
    layout: "/auth"
  },
  {
    collapse: true,
    name: "Management",
    // rtlName: "صفحات",
    icon: "tim-icons icon-badge",
    state: "pagesCollapse",
    views: [
      // {
      //   path: "/pricing",
      //   name: "Pricing",
      //   rtlName: "عالتسعير",
      //   mini: "P",
      //   rtlMini: "ع",
      //   component: Pricing,
      //   layout: "/auth"
      // },
      // {
      //   path: "/rtl-support",
      //   name: "RTL Support",
      //   rtlName: "صودعم رتل",
      //   mini: "RS",
      //   rtlMini: "صو",
      //   component: Rtl,
      //   layout: "/rtl"
      // },
      // {
      //   path: "/timeline",
      //   name: "Timeline",
      //   rtlName: "تيالجدول الزمني",
      //   mini: "T",
      //   rtlMini: "تي",
      //   component: Timeline,
      //   layout: "/admin"
      // },
      {
        path: "/login",
        name: "Login",
        rtlName: "هعذاتسجيل الدخول",
        mini: "L",
        rtlMini: "هعذا",
        component: Login,
        layout: "/auth",
      },
      {
        path: "/leads",
        name: "Leads",
        component: Leads,
        layout: "/admin",
        adminOnly: true
      },
      {
        path: "/login",
        name: "Dealership Login",
        component: DealershipLogin,
        layout: "/authentication",
      },
      {
        path: "/new_dealer_mgmt",
        name: "Dealer Mangement",
        component: DealershipManagement,
        layout: "/admin",
        adminOnly: true,
        icon: "tim-icons icon-delivery-fast"
      },
      {
        path: "/user_mgmt",
        name: "User Mangement",
        component: UserManagement,
        layout: "/admin",
        adminOnly: true,
        icon: "tim-icons icon-single-02"
      },
      {
        path: "/dealership_user_mgmt",
        name: "Dealership Users",
        component: DealershipUsers,
        layout: "/admin",
        adminOnly: true,
        icon: "tim-icons icon-single-02"
      },
      // {
      //   path: "/users",
      //   name: "Users",
      //   component: Users,
      //   layout: "/admin",
      //   adminOnly: true,
      //   icon: "tim-icons icon-single-02"
      // },
      // {
      //   path: "/dealerships",
      //   name: "Dealerships",
      //   component: Dealerships,
      //   layout: "/admin",
      //   adminOnly: true,
      //   icon: "tim-icons icon-delivery-fast"
      // },
      {
        path: "/sources",
        name: "Sources",
        component: Sources,
        layout: "/admin",
        adminOnly: true,
        icon: "tim-icons icon-vector"
      },
      {
        path: "/teams",
        name: "Teams",
        component: Teams,
        layout: "/admin",
        adminOnly: true,
        icon: "tim-icons icon-trophy"
      },
      {
        path: "/scenarios",
        name: "Scenarios",
        component: Scenarios,
        layout: "/admin",
        adminOnly: true,
        icon: "tim-icons icon-laptop"
      },
      {
        path: "/dealership_history",
        name: "Dealership History",
        component: DealershipHistoryNew,
        layout: "/admin",
        adminOnly: true,
        icon: "tim-icons icon-notes"
      },
      // {
      //   path: "/dealership_history_new",
      //   name: "Dealership History 2",
      //   component: DealershipHistoryNew,
      //   layout: "/admin",
      //   adminOnly: true,
      //   icon: "tim-icons icon-notes"
      // },
      {
        path: "/failed_texts",
        name: "Failed Texts",
        component: FailedTexts,
        layout: "/admin",
        adminOnly: true,
        icon: "tim-icons icon-alert-circle-exc"
      },
      // {
      //   path: "/lock-screen",
      //   name: "Lock Screen",
      //   rtlName: "اقفل الشاشة",
      //   mini: "LS",
      //   rtlMini: "هذاع",
      //   component: Lock,
      //   layout: "/auth"
      // },
      // {
      //   path: "/user-profile",
      //   name: "User Profile",
      //   rtlName: "ملف تعريفي للمستخدم",
      //   mini: "UP",
      //   rtlMini: "شع",
      //   component: User,
      //   layout: "/admin"
      // }
    ]
  },
  {
    collapse: true,
    name: "Appointments",
    icon: "tim-icons icon-calendar-60",
    state: "appointmentsCollapse",
    views: [
      {
        path: "/new_appointment",
        name: "Create New Appointment",
        component: NewApp,
        layout: "/admin",
        adminOnly: false,
        icon: "tim-icons icon-simple-add",
      },
      // {
      //   path: "/approve",
      //   name: "Pending Appointments",
      //   component: Approve,
      //   layout: "/admin",
      //   adminOnly: false,
      //   icon: "tim-icons icon-notes"
      // },
      // {
      //   path: "/rejected",
      //   name: "Rejected Appointments",
      //   component: Rejected,
      //   layout: "/admin",
      //   adminOnly: false,
      //   icon: "tim-icons icon-settings"
      // },
      {
        path: "/appointment_history",
        name: "Appointment History",
        component: AppointmentHistory,
        layout: "/admin",
        adminOnly: false,
        icon: "tim-icons icon-single-copy-04"
      },
      // {
      //   path: "/appointment_search",
      //   name: "Appointment Search",
      //   component: AppointmentSearch,
      //   layout: "/admin",
      //   adminOnly: true,
      //   icon: "tim-icons icon-light-3"
      // },
      {
        path: "/appointment_search",
        name: "Appointment Search",
        component: AppointmentSearchNew,
        layout: "/admin",
        adminOnly: true,
        icon: "tim-icons icon-light-3"
      }
    ]
  },
  {
    collapse: true,
    name: "Follow-ups",
    icon: "tim-icons icon-alert-circle-exc",
    state: "componentsCollapse",
    views: [
      {
        path: "/assistance",
        name: "Create Follow-up",
        component: Assistance,
        layout: "/admin",
        adminOnly: false,
        icon: "tim-icons icon-simple-add"
      },
      {
        path: "/approve_assistance",
        name: "Pending Follow-ups",
        component: ApproveAssistance,
        layout: "/admin",
        adminOnly: false,
        icon: "tim-icons icon-notes"
      },
      {
        path: "/rejected_assistance",
        name: "Rejected Follow-ups",
        component: RejectedAssistance,
        layout: "/admin",
        adminOnly: false,
        icon: "tim-icons icon-settings"
      }
    ]
  },
  //     {
  //       path: "/buttons",
  //       name: "Buttons",
  //       rtlName: "وصفت",
  //       mini: "B",
  //       rtlMini: "ب",
  //       component: Buttons,
  //       layout: "/admin"
  //     },
  //     {
  //       path: "/grid-system",
  //       name: "Grid System",
  //       rtlName: "نظام الشبكة",
  //       mini: "GS",
  //       rtlMini: "زو",
  //       component: Grid,
  //       layout: "/admin"
  //     },
  //     {
  //       path: "/panels",
  //       name: "Panels",
  //       rtlName: "لوحات",
  //       mini: "P",
  //       rtlMini: "ع",
  //       component: Panels,
  //       layout: "/admin"
  //     },
  //     {
  //       path: "/sweet-alert",
  //       name: "Sweet Alert",
  //       rtlName: "الحلو تنبيه",
  //       mini: "SA",
  //       rtlMini: "ومن",
  //       component: SweetAlert,
  //       layout: "/admin"
  //     },
  //     {
  //       path: "/notifications",
  //       name: "Notifications",
  //       rtlName: "إخطارات",
  //       mini: "N",
  //       rtlMini: "ن",
  //       component: Notifications,
  //       layout: "/admin"
  //     },
  //     {
  //       path: "/icons",
  //       name: "Icons",
  //       rtlName: "الرموز",
  //       mini: "I",
  //       rtlMini: "و",
  //       component: Icons,
  //       layout: "/admin"
  //     },
  //     {
  //       path: "/typography",
  //       name: "Typography",
  //       rtlName: "طباعة",
  //       mini: "T",
  //       rtlMini: "ر",
  //       component: Typography,
  //       layout: "/admin"
  //     }
  //   ]
  // },
  // {
  //   collapse: true,
  //   name: "Forms",
  //   rtlName: "إستمارات",
  //   icon: "tim-icons icon-notes",
  //   state: "formsCollapse",
  //   views: [
  //     {
  //       path: "/regular-forms",
  //       name: "Regular Forms",
  //       rtlName: "أشكال عادية",
  //       mini: "RF",
  //       rtlMini: "صو",
  //       component: RegularForms,
  //       layout: "/admin"
  //     },
  //     {
  //       path: "/extended-forms",
  //       name: "Extended Forms",
  //       rtlName: "نماذج موسعة",
  //       mini: "EF",
  //       rtlMini: "هوو",
  //       component: ExtendedForms,
  //       layout: "/admin"
  //     },
  //     {
  //       path: "/validation-forms",
  //       name: "Validation Forms",
  //       rtlName: "نماذج التحقق من الصحة",
  //       mini: "VF",
  //       rtlMini: "تو",
  //       component: ValidationForms,
  //       layout: "/admin"
  //     },
  //     {
  //       path: "/wizard",
  //       name: "Wizard",
  //       rtlName: "ساحر",
  //       mini: "W",
  //       rtlMini: "ث",
  //       component: Wizard,
  //       layout: "/admin"
  //     }
  //   ]
  // },
  // {
  //   collapse: true,
  //   name: "Tables",
  //   rtlName: "الجداول",
  //   icon: "tim-icons icon-puzzle-10",
  //   state: "tablesCollapse",
  //   views: [
  //     {
  //       path: "/regular-tables",
  //       name: "Regular Tables",
  //       rtlName: "طاولات عادية",
  //       mini: "RT",
  //       rtlMini: "صر",
  //       component: RegularTables,
  //       layout: "/admin"
  //     },
  //     {
  //       path: "/extended-tables",
  //       name: "Extended Tables",
  //       rtlName: "جداول ممتدة",
  //       mini: "ET",
  //       rtlMini: "هور",
  //       component: ExtendedTables,
  //       layout: "/admin"
  //     },
  //     {
  //       path: "/react-tables",
  //       name: "React Tables",
  //       rtlName: "رد فعل الطاولة",
  //       mini: "RT",
  //       rtlMini: "در",
  //       component: ReactTables,
  //       layout: "/admin"
  //     }
  //   ]
  // },
  // {
  //   collapse: true,
  //   name: "Maps",
  //   rtlName: "خرائط",
  //   icon: "tim-icons icon-pin",
  //   state: "mapsCollapse",
  //   views: [
  //     {
  //       path: "/google-maps",
  //       name: "Google Maps",
  //       rtlName: "خرائط جوجل",
  //       mini: "GM",
  //       rtlMini: "زم",
  //       component: GoogleMaps,
  //       layout: "/admin"
  //     },
  //     {
  //       path: "/full-screen-map",
  //       name: "Full Screen Map",
  //       rtlName: "خريطة كاملة الشاشة",
  //       mini: "FSM",
  //       rtlMini: "ووم",
  //       component: FullScreenMap,
  //       layout: "/admin"
  //     },
  //     {
  //       path: "/vector-map",
  //       name: "Vector Map",
  //       rtlName: "خريطة المتجه",
  //       mini: "VM",
  //       rtlMini: "تم",
  //       component: VectorMap,
  //       layout: "/admin"
  //     }
  //   ]
  // },
  // {
  //   path: "/widgets",
  //   name: "Widgets",
  //   rtlName: "الحاجيات",
  //   icon: "tim-icons icon-settings",
  //   component: Widgets,
  //   layout: "/admin"
  // },
  // {
  //   path: "/charts",
  //   name: "Charts",
  //   rtlName: "الرسوم البيانية",
  //   icon: "tim-icons icon-chart-bar-32",
  //   component: Charts,
  //   layout: "/admin"
  // },
  // {
  //   path: "/calendar",
  //   name: "Calendar",
  //   rtlName: "التقويم",
  //   icon: "tim-icons icon-time-alarm",
  //   component: Calendar,
  //   layout: "/admin"
  // }
];

export default routes;
