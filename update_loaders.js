const fs = require('fs');
const path = './Frontend/src/features/interview/pages/Home.jsx';
let content = fs.readFileSync(path, 'utf8');

// Replace RefreshCwIcon import with LayersIcon if not imported
if (!content.includes('LayersIcon,')) {
    content = content.replace('RefreshCwIcon,', 'RefreshCwIcon, LayersIcon,');
}

// Replace the spinner in the generate button
content = content.replace(/<RefreshCwIcon size=\{20\} className="spin-icon" \/>/g, '<LayersIcon size={20} className="spin-icon" />');

// Replace the glowing orbs in the aurora loader with a central spinning logo
const oldLoader = <div className="aurora-loader">
                                <div className="aurora-orb orb-1"></div>
                                <div className="aurora-orb orb-2"></div>
                                <div className="aurora-orb orb-3"></div>
                            </div>;
const newLoader = <div className="aurora-loader">
                                <div className="logo-icon-box" style={{background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', boxShadow: '0 4px 20px rgba(59, 130, 246, 0.6)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', animation: 'pulse 2s infinite'}}>
                                    <LayersIcon size={32} className="spin-icon" />
                                </div>
                            </div>;
                            
content = content.replace(oldLoader, newLoader);

fs.writeFileSync(path, content, 'utf8');
console.log('Updated loading states in Home.jsx');
