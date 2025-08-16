export const stepStyles = {
  container: 'max-w-4xl mx-auto p-6',
  
  card: 'bg-white rounded-2xl shadow-xl p-8 w-full mx-auto border border-slate-200',
  
  cardSmall: 'bg-white rounded-2xl p-6 shadow-xl w-full mx-auto border border-slate-200',
  
  header: 'text-3xl font-bold text-gray-800 mb-2',
  
  title: 'text-3xl font-bold text-[#3e1a78] mb-3',
  
  subtitle: 'text-lg text-blue-600 font-medium',
  
  subtitlePurple: 'text-lg text-[#7c3aed] font-medium',
  
  description: 'text-slate-700 leading-relaxed',
  
  divider: 'mb-6 pb-6 border-b border-slate-200',
  
  flexCenter: 'flex flex-col items-center gap-6',
  
  flexRow: 'flex flex-col sm:flex-row gap-4 justify-center',
  
  button: {
    primary: 'px-8 py-3 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl',
    
    secondary: 'px-8 py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl',
    
    success: 'px-8 py-3 bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl',
    
    danger: 'px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl',
    
    gray: 'px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors shadow-lg hover:shadow-xl',
    
    disabled: 'bg-slate-300 text-slate-500 cursor-not-allowed',
  },
  
  progress: {
    container: 'text-sm font-medium',
    purple: 'text-[#7c3aed]',
    blue: 'text-blue-600',
    green: 'text-[#22c55e]',
  },
  
  infoBox: {
    container: 'p-4 rounded-xl',
    blue: 'bg-blue-50 text-blue-800',
    green: 'bg-green-50 text-green-800',
    red: 'bg-red-50 text-red-800',
    gray: 'bg-gray-50 text-gray-800',
  },
  
  list: {
    container: 'space-y-2',
    item: 'flex items-start',
    bullet: 'mr-2',
    bulletBlue: 'text-blue-500',
    bulletPurple: 'text-[#7c3aed]',
    bulletRed: 'text-red-500',
    text: 'text-gray-700',
  },
  
  grid: {
    cols2: 'grid grid-cols-1 md:grid-cols-2 gap-2',
    cols3: 'grid grid-cols-2 sm:grid-cols-3 gap-2',
    cols4: 'grid grid-cols-2 md:grid-cols-4 gap-2',
  },
  
  spacing: {
    mb2: 'mb-2',
    mb3: 'mb-3',
    mb4: 'mb-4',
    mb6: 'mb-6',
    mb8: 'mb-8',
    mt4: 'mt-4',
    mt6: 'mt-6',
    mt8: 'mt-8',
  }
};