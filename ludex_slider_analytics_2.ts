import fs from 'fs';

let appText = fs.readFileSync('src/App.tsx', 'utf-8');

appText = appText.replace(/const \[promotions, setPromotions\] = useState\(\[/g,
`

  const [promoBanners, setPromoBanners] = useState([
     { id: '1', title: 'Summer Gaming Festival', image: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=1200', target_url: '#', is_active: true, display_order: 1 },
     { id: '2', title: 'Action Packed Weekend', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200', target_url: '#', is_active: true, display_order: 2 }
  ]);
  const [heroSlideIdx, setHeroSlideIdx] = useState(0);

  useEffect(() => {
     const int = setInterval(() => {
        setHeroSlideIdx(prev => (prev + 1));
     }, 5000);
     return () => clearInterval(int);
  }, []);

const [promotions, setPromotions] = useState([`
);

fs.writeFileSync('src/App.tsx', appText);
