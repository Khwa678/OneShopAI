import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function TopBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="top-banner">
      <span>Experience the best with our premium plans – unlock exclusive features now!</span>
      <button 
        className="close-banner" 
        onClick={() => setVisible(false)}
        title="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}
