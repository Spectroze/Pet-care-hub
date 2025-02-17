"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import AppointmentCalendar from "../pet-training/appointments/page";
import TrainingNotifications from "../pet-training/notifications/page";
import Feedback from "../pet-training/feedback/page";
import Archived from "../pet-training/archived/page";
import Pets from "../pet-training/pets/page";
import { getCurrentUser, fetchUserAndPetInfo } from "@/lib/appwrite";
import {
  Menu,
  Home,
  Calendar as CalendarIcon,
  PawPrint,
  Users,
  BarChart2,
  LogOut,
  MessageCircle,
  Bell,
  Archive,
  MenuIcon,
  Edit,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

// Mock user data for the avatar
const ownerInfo = {
  name: " ",
  avatarUrl: " ",
};

// Navigation Items
const navigationItems = [
  { id: "overview", name: "Overview", icon: Home },
  { id: "appointments", name: "Appointments", icon: CalendarIcon },
  { id: "feedback", name: "Feedback", icon: MessageCircle },
  { id: "pets", name: "Pets", icon: PawPrint },
  { id: "notifications", name: "Notifications", icon: Bell },
  { id: "archived", name: "Archived", icon: Archive },
];

function Overview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-bold text-gray-100">Total Appointments</h2>
        <p className="text-2xl text-gray-100">24</p>
        <p className="text-sm text-gray-400">+10% from last month</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-bold text-gray-100">Total Pets</h2>
        <p className="text-2xl text-gray-100">145</p>
        <p className="text-sm text-gray-400">+5% from last month</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-bold text-gray-100">Total Owners</h2>
        <p className="text-2xl text-gray-100">98</p>
        <p className="text-sm text-gray-400">+2% from last month</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-bold text-gray-100">Revenue</h2>
        <p className="text-2xl text-gray-100">$12,345</p>
        <p className="text-sm text-gray-400">+15% from last month</p>
      </div>
    </div>
  );
}

export default function PetTrainingDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const [isEditingOwner, setIsEditingOwner] = useState(false);
  const toggleEditOwner = () => setIsEditingOwner((prev) => !prev);
  const [userId, setUserId] = useState(null); // Declare userId state
  const [loading, setLoading] = useState(true); // Add loading state

  const [ownerInfo, setOwnerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    avatarUrl: "/placeholder.svg",
  });
  const handleOwnerChange = (e) => {
    const { name, value } = e.target;
    setOwnerInfo((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser && currentUser.$id) {
          setUserId(currentUser.$id);
        } else {
          router.push("/");
        }
      } catch (err) {
        console.error("Error fetching current user: ", err);
        router.push("/");
      }
    };
    checkSession();
  }, [router]);

  useEffect(() => {
    if (!userId) return;

    const loadData = async () => {
      try {
        // Fetch user and pet data associated with the authenticated user
        const { user, pet } = await fetchUserAndPetInfo(userId);

        // Update owner info state with user-specific data
        setOwnerInfo({
          name: user?.name || "Guest",
          avatarUrl: user?.avatar || "/placeholder.svg", // Default avatar if none exists
        });
      } catch (error) {
        console.error("Failed to load user or pet data:", error);
        setError("Failed to load user or pet data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  const handleSaveOwner = async () => {
    try {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        userId,
        {
          name: ownerInfo.name,
          email: ownerInfo.email,
          phone: ownerInfo.phone,
        }
      );
      setIsEditingOwner(false);
      toast.success("Profile updated successfully!"); // Show success toast
    } catch (error) {
      console.error("Error updating owner:", error);
      toast.error("Failed to update profile."); // Show error toast
    }
  };

  const handleLogout = () => {
    toast.success("Successfully logged out!");
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 ${
          sidebarOpen ? "w-64" : "w-20"
        } min-h-screen p-4 flex flex-col relative transition-all`}
      >
        <Button
          variant="outline"
          className={`absolute top-4 right-4 transition-all ${
            sidebarOpen ? "mr-2" : "ml-0"
          } bg-gray-700 text-gray-200 hover:bg-gray-600`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <MenuIcon className="h-5 w-5" />
        </Button>

        <div className="flex flex-col items-center mt-16 space-y-2">
          {/* Avatar with onClick handler to toggle editing */}
          <Avatar
            className="h-20 w-20 border-2 border-gray-600 cursor-pointer"
            onClick={toggleEditOwner}
          >
            <AvatarImage src={ownerInfo.avatarUrl} alt="User" />
            <AvatarFallback>{ownerInfo.name?.[0] || "U"}</AvatarFallback>
          </Avatar>

          {sidebarOpen && (
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-gray-200">
                {ownerInfo.name || "Guest"}
              </p>
              <p className="text-xs text-gray-400">Pet Training</p>

              {isEditingOwner ? (
                <>
                  <Input
                    name="name"
                    value={ownerInfo.name}
                    onChange={handleOwnerChange}
                    placeholder="Name"
                    className="mt-2 bg-gray-700 text-gray-100"
                  />
                  <Input
                    name="email"
                    value={ownerInfo.email}
                    onChange={handleOwnerChange}
                    placeholder="Email"
                    className="mt-2 bg-gray-700 text-gray-100"
                  />
                  <Input
                    name="phone"
                    value={ownerInfo.phone}
                    onChange={handleOwnerChange}
                    placeholder="Phone"
                    className="mt-2 bg-gray-700 text-gray-100"
                  />
                  <Button
                    onClick={handleSaveOwner}
                    className="bg-blue-600 hover:bg-blue-700 text-white mt-2"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Save Profile
                  </Button>
                </>
              ) : (
                <></>
              )}
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2 border-t border-gray-700 pt-4 mt-4">
          {navigationItems.map(({ id, name, icon: Icon }) => (
            <Button
              key={id}
              variant={activeTab === id ? "secondary" : "ghost"}
              className={`w-full justify-start ${!sidebarOpen && "px-2"} ${
                activeTab === id ? "bg-gray-700" : "hover:bg-gray-700"
              } text-gray-200`}
              onClick={() => setActiveTab(id)}
            >
              <Icon className={`h-5 w-5 ${sidebarOpen && "mr-2"}`} />
              {sidebarOpen && <span>{name}</span>}
            </Button>
          ))}
        </nav>
        <Button
          variant="ghost"
          className={`w-full mt-auto justify-start ${
            !sidebarOpen && "px-2"
          } text-red-500 hover:bg-gray-700`}
          onClick={handleLogout}
        >
          <LogOut className={`h-5 w-5 ${sidebarOpen && "mr-2"}`} />
          {sidebarOpen && <span>Logout</span>}
        </Button>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-4 overflow-auto bg-gray-900">
        {/* Dynamic Content */}
        {activeTab === "overview" && <Overview />}
        {activeTab === "appointments" && <AppointmentCalendar />}
        {activeTab === "feedback" && <Feedback />}
        {activeTab === "notifications" && <TrainingNotifications />}
        {activeTab === "archived" && <Archived />}
        {activeTab === "pets" && <Pets />}
      </main>
    </div>
  );
}
