import { motion } from 'framer-motion';

export function CategoryCard({ category, onClick }) {
  const Icon = category.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="relative group cursor-pointer"
      onClick={onClick}
    >
      <div className="p-6 bg-black/30 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
        {/* Gradient background overlay */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
        
        {/* Content */}
        <div className="relative z-10 space-y-4">
          {/* Icon */}
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${category.color} bg-opacity-20 flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:via-blue-500 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
            {category.name}
          </h3>
          
          {/* Description */}
          <p className="text-gray-400 text-sm leading-relaxed">
            {category.description}
          </p>
          
          {/* Hover arrow */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-2 text-sm font-medium text-cyan-400">
              Explore category
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 