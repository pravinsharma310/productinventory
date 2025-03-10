"use client";
import { AppBar, Toolbar, Typography, Avatar, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Header({ title,user, onLogout }) {
  const router = useRouter();
    console.log(title,"titletitle")
  return (
    <AppBar position="static" className="bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg">
      <Toolbar className="flex justify-between items-center px-4 py-2">
        {/* Logo or Brand Name */}
        <Typography variant="h6" className="font-bold text-white">
          {title}
        </Typography>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <Avatar
            src={user?.avatar || "/default-avatar.png"} 
            alt={user?.firstName || "User"}
            className="border-2 border-white shadow-md"
          />
          <div className="text-white">
            <p className="font-semibold">{user?.firstName || "Guest"}</p>
            <p className="text-sm opacity-75 capitalize">{user?.type || "Unknown"}</p>
          </div>

          {/* Logout Button */}
          <Button
            variant="contained"
            color="error"
            className="bg-red-500 text-white hover:bg-red-600"
            onClick={onLogout}
          >
            Logout
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}
