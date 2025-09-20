import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ReactComponent as TallyIcon } from '../icons/Tally Icon.svg';
import { ReactComponent as ComponentsActiveSvg } from '../icons/Property 1=Components - Active.svg';
import { ReactComponent as ComponentsInactiveSvg } from '../icons/Property 1=Components - Inactive.svg';
import { ReactComponent as ProductsActiveSvg } from '../icons/Property 1=Products  - Active.svg';
import { ReactComponent as ProductsInactiveSvg } from '../icons/Property 1=Products  - Inactive.svg';
import { ReactComponent as OrdersActiveSvg } from '../icons/Property 1=Orders - Active.svg';
import { ReactComponent as OrdersInactiveSvg } from '../icons/Property 1=Orders - Inactive.svg';
import { ReactComponent as IntegrationsActiveSvg } from '../icons/Property 1=Integrations - Active.svg';
import { ReactComponent as IntegrationsInactiveSvg } from '../icons/Property 1=Integrations - Inactive.svg';
import { ReactComponent as LogoutIcon } from '../icons/Login/Frame.svg';
import profileImage from '../icons/Login/image 23.png';

interface SidebarProps {
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: (expanded: boolean) => void;
}

export function Sidebar({ isSidebarExpanded, setIsSidebarExpanded }: SidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <motion.aside 
      className="sidebar bg-gray-100 border-r border-gray-200 flex flex-col py-5 fixed h-screen left-0 top-0 z-50 overflow-hidden"
      initial={{ width: "4rem" }}
      animate={{ width: isSidebarExpanded ? "12rem" : "4rem" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onHoverStart={() => setIsSidebarExpanded(true)}
      onHoverEnd={() => setIsSidebarExpanded(false)}
    >
      {/* Logo Section */}
      <div className="sidebar-logo mb-8 flex items-center justify-center md:justify-start px-3">
        <div className="logo-icon flex items-center justify-center w-9 h-9 flex-shrink-0"><TallyIcon /></div>
        <motion.div 
          className="ml-3 font-medium text-gray-700 text-xl whitespace-nowrap overflow-hidden tracking-wide"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: isSidebarExpanded ? 1 : 0, width: isSidebarExpanded ? "auto" : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          Tally
        </motion.div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav flex flex-col gap-2 w-full px-2 flex-grow">
        {/* Materials Link */}
        <Link to="/" className={`nav-item ${pathname === '/' ? 'bg-gray-200' : ''} rounded-lg hover:bg-gray-200 transition-colors flex items-center h-10`}>
          <div className="w-full flex items-center justify-center md:justify-start px-2">
            <div className="flex items-center justify-center w-6 h-6">
              {pathname === '/' ? <ComponentsActiveSvg /> : <ComponentsInactiveSvg />}
            </div>
            <motion.span 
              className="ml-2 text-sm font-medium text-gray-700 whitespace-nowrap overflow-hidden"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: isSidebarExpanded ? 1 : 0, width: isSidebarExpanded ? "auto" : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              Materials
            </motion.span>
          </div>
        </Link>

        {/* Products Link */}
        <Link to="/products" className={`nav-item ${pathname === '/products' ? 'bg-gray-200' : ''} rounded-lg hover:bg-gray-200 transition-colors flex items-center h-10`}>
          <div className="w-full flex items-center justify-center md:justify-start px-2">
            <div className="flex items-center justify-center w-6 h-6">
              {pathname === '/products' ? <ProductsActiveSvg /> : <ProductsInactiveSvg />}
            </div>
            <motion.span 
              className="ml-2 text-sm font-medium text-gray-700 whitespace-nowrap overflow-hidden"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: isSidebarExpanded ? 1 : 0, width: isSidebarExpanded ? "auto" : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              Products
            </motion.span>
          </div>
        </Link>

        {/* Fulfillment Link */}
        <Link to="/fulfillment" className={`nav-item ${pathname === '/fulfillment' ? 'bg-gray-200' : ''} rounded-lg hover:bg-gray-200 transition-colors flex items-center h-10`}>
          <div className="w-full flex items-center justify-center md:justify-start px-2">
            <div className="flex items-center justify-center w-6 h-6">
              {pathname === '/fulfillment' ? <OrdersActiveSvg /> : <OrdersInactiveSvg />}
            </div>
            <motion.span 
              className="ml-2 text-sm font-medium text-gray-700 whitespace-nowrap overflow-hidden"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: isSidebarExpanded ? 1 : 0, width: isSidebarExpanded ? "auto" : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              Fulfillment
            </motion.span>
          </div>
        </Link>

        {/* Integrations Link */}
        <Link to="/integrations" className={`nav-item ${pathname === '/integrations' ? 'bg-gray-200' : ''} rounded-lg hover:bg-gray-200 transition-colors flex items-center h-10`}>
          <div className="w-full flex items-center justify-center md:justify-start px-2">
            <div className="flex items-center justify-center w-6 h-6">
              {pathname === '/integrations' ? <IntegrationsActiveSvg /> : <IntegrationsInactiveSvg />}
            </div>
            <motion.span 
              className="ml-2 text-sm font-medium text-gray-700 whitespace-nowrap overflow-hidden"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: isSidebarExpanded ? 1 : 0, width: isSidebarExpanded ? "auto" : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              Integrations
            </motion.span>
          </div>
        </Link>
      </nav>
      
      {/* User Profile Section */}
      <div className="sidebar-footer mt-auto px-2 pt-4 border-t border-gray-200 flex flex-col gap-2">
        {/* Logout Button */}
        <button className="nav-item rounded-lg hover:bg-gray-200 transition-colors flex items-center h-10">
          <div className="w-full flex items-center justify-center md:justify-start px-2">
            <div className="flex items-center justify-center w-6 h-6">
              <LogoutIcon />
            </div>
            <motion.span 
              className="ml-2 text-sm font-medium text-gray-700 whitespace-nowrap overflow-hidden"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: isSidebarExpanded ? 1 : 0, width: isSidebarExpanded ? "auto" : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              Logout
            </motion.span>
          </div>
        </button>
        
        {/* Profile Photo */}
        <div className="profile-photo px-2 py-2 mb-2">
          <div className="flex items-center">
            <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-gray-300">
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="ml-2">
              <motion.div 
                className="flex items-center justify-between w-full"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: isSidebarExpanded ? 1 : 0, width: isSidebarExpanded ? "auto" : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap overflow-hidden">Username</span>
                <span className="text-gray-500 ml-4">...</span>
              </motion.div>
              <motion.div
                className="text-xs text-gray-500"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: isSidebarExpanded ? 1 : 0, width: isSidebarExpanded ? "auto" : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                Label
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}