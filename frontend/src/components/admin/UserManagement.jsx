import React, { useState } from "react";
import {
  Users,
  Search,
  MoreHorizontal,
  Trash2,
  ShieldCheck,
  User as UserIcon,
  Filter,
  ArrowUpDown,
  Mail,
} from "lucide-react";
import { SkeletonForm } from "../Skeleton";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
} from "@/services/adminApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

function UserManagement() {
  const { data: users, isLoading, error } = useGetAllUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users?.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const deleteHandler = (id) => async (e) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id).unwrap();
      } catch (error) {}
    }
  };
  if (isLoading) return <SkeletonForm />;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* HEADER SECTION - Balanced Scale */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            User Management
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage and audit user accounts across the platform.
          </p>
        </div>
        <div className="bg-primary/5 border border-primary/10 rounded-lg px-4 py-2 flex items-center gap-3">
          <Users className="h-5 w-5 text-primary" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-medium uppercase">
              Live Users
            </span>
            <span className="text-lg font-bold leading-none">
              {users?.length || 0}
            </span>
          </div>
        </div>
      </div>

      {/* SEARCH BAR - Standard Pro Height */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name or email..."
            className="h-10 pl-10 text-sm focus-visible:ring-primary shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-10 gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      {/* TABLE - Professional Density */}
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold py-4">User Details</TableHead>
              <TableHead className="font-semibold">Access Level</TableHead>
              <TableHead className="font-semibold hidden md:table-cell">
                Registration Date
              </TableHead>
              <TableHead className="text-right font-semibold pr-6">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers?.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow
                  key={user._id}
                  className="group hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border shadow-sm transition-transform group-hover:scale-105">
                        <AvatarImage src={user.avatar?.url} alt={user.name} />
                        <AvatarFallback className="font-medium bg-muted text-muted-foreground">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm sm:text-base leading-tight">
                          {user.name}
                        </span>
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.isAdmin ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20 rounded-md font-semibold px-2 py-0.5">
                        Admin
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="rounded-md px-2 py-0.5 font-medium"
                      >
                        User
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                    {new Date(user.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button
                      onClick={deleteHandler(user._id)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4  text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-48 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Search className="h-8 w-8 opacity-20" />
                    <p className="text-sm font-medium">
                      No results found for "{searchTerm}"
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default UserManagement;
