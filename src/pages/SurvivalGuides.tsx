import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GuideCard } from '@/components/GuideCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Guide } from '@/db/database';
import { getGuides } from '@/services/offlineService';
import { Skeleton } from '@/components/ui/skeleton';
import { getFavoriteGuideIds, getCompletedGuideIds } from '@/services/guideService';

/**
 * Survival Guides List Page
 * Shows all available guides with search and filter
 */
const SurvivalGuides = () => {
  const navigate = useNavigate();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [filteredGuides, setFilteredGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Load guides and favorites/completed from IndexedDB
  useEffect(() => {
    const loadGuides = async () => {
      try {
        const [data, favIds, compIds] = await Promise.all([
          getGuides(),
          getFavoriteGuideIds(),
          getCompletedGuideIds()
        ]);
        setGuides(data);
        setFilteredGuides(data);
        setFavoriteIds(favIds);
        setCompletedIds(compIds);
      } catch (error) {
        console.error('Error loading guides:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGuides();
  }, []);

  // Filter guides based on search, category, and favorites
  useEffect(() => {
    let filtered = guides;

    // Filter by favorites
    if (showFavoritesOnly) {
      filtered = filtered.filter(g => favoriteIds.includes(g.id));
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(g => g.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(g =>
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredGuides(filtered);
  }, [searchQuery, selectedCategory, guides, showFavoritesOnly, favoriteIds]);

  const categories = ['all', ...Array.from(new Set(guides.map(g => g.category)))];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold mb-2">Survival Guides</h1>
          <p className="text-muted-foreground">
            {guides.length} emergency procedures available offline
          </p>
        </div>

        {/* Search */}
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Favorites Toggle */}
        <div className="mb-4">
          <Button
            variant={showFavoritesOnly ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className="w-full md:w-auto"
          >
            <Star className={`h-4 w-4 mr-2 ${showFavoritesOnly ? 'fill-current' : ''}`} />
            {showFavoritesOnly ? 'Showing Favorites' : 'Show Favorites'} ({favoriteIds.length})
          </Button>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="whitespace-nowrap"
            >
              {cat === 'all' ? 'All Categories' : cat}
            </Button>
          ))}
        </div>

        {/* Guides List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : filteredGuides.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {guides.length === 0
                ? 'No guides downloaded yet. Go to Settings to download offline content.'
                : 'No guides match your search.'}
            </p>
            {guides.length === 0 && (
              <Button onClick={() => navigate('/settings')}>
                Go to Settings
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredGuides.map((guide) => (
              <GuideCard
                key={guide.id}
                guide={guide}
                onClick={() => navigate(`/guide/${guide.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SurvivalGuides;
