import React from 'react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { User, Calendar, Settings, LogOut, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const UserMenu: React.FC = () => {
  const { user, signOut } = useAuth();

  if (!user) return null;

  const initials = user.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : user.email?.[0]?.toUpperCase() || 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2 text-white hover:text-primary transition-colors rounded-full p-1 hover:bg-white/10">
          <Avatar className="h-8 w-8 border-2 border-white/20">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56 bg-black/90 border-white/20">
        <DropdownMenuLabel className="text-white">
          {user.user_metadata?.full_name || user.email}
          <div className="text-xs text-white/60 font-normal">
            {user.role === 'admin' ? 'Administrator' : 'Guest Account'}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/20" />
        
        {user.role === 'admin' ? (
          <DropdownMenuItem asChild className="text-white hover:bg-white/10 cursor-pointer">
            <Link to="/admin">
              <Shield className="mr-2 h-4 w-4" />
              Admin Dashboard
            </Link>
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem asChild className="text-white hover:bg-white/10 cursor-pointer">
              <Link to="/dashboard">
                <User className="mr-2 h-4 w-4" />
                My Dashboard
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild className="text-white hover:bg-white/10 cursor-pointer">
              <Link to="/dashboard">
                <Calendar className="mr-2 h-4 w-4" />
                My Bookings
              </Link>
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuItem className="text-white hover:bg-white/10 cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-white/20" />
        
        <DropdownMenuItem 
          className="text-white hover:bg-white/10 cursor-pointer"
          onClick={signOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};