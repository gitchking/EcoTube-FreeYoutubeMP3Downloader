import { Leaf, Music, Star, Heart, Check } from "lucide-react";

export default function DebugIconTest() {
  console.log("DebugIconTest rendering");
  console.log("Leaf component:", Leaf);
  console.log("Music component:", Music);
  
  return (
    <div className="p-4 bg-red-100 border border-red-500 m-4">
      <h3 className="font-bold mb-2">Icon Debug Test</h3>
      <div className="flex gap-4 items-center mb-2">
        <div style={{ width: '24px', height: '24px', background: 'yellow', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Leaf size={24} className="text-green-500" style={{ display: 'block' }} />
        </div>
        <div style={{ width: '24px', height: '24px', background: 'yellow', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Music size={24} className="text-blue-500" style={{ display: 'block' }} />
        </div>
        <div style={{ width: '24px', height: '24px', background: 'yellow', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Star size={24} className="text-red-500" style={{ display: 'block' }} />
        </div>
        <div style={{ width: '24px', height: '24px', background: 'yellow', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Heart size={24} className="text-purple-500" style={{ display: 'block' }} />
        </div>
        <div style={{ width: '24px', height: '24px', background: 'yellow', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Check size={24} className="text-orange-500" style={{ display: 'block' }} />
        </div>
      </div>
      <div className="text-sm">
        Icons should appear in yellow boxes above. If boxes are empty, there's an icon loading issue.
      </div>
      <div className="text-xs mt-1">
        Check browser console for debug logs.
      </div>
    </div>
  );
}