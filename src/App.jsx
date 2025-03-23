import Header from './components/Header';
import FilterPanel from './components/FilterPanel';
import ProfessionalsList from './components/ProfessionalsList';
import useProfessionals from './hooks/useProfessionals';

function App() {
  const {
    professionals,
    loading,
    error,
    loadProfessionals,
    loadMore,
    hasMore,
    params
  } = useProfessionals();

  const handleApplyFilters = (filters) => {
    loadProfessionals(filters);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Professional Talent Directory</h2>
          <p className="text-gray-600">Discover top professionals in the industry</p>
        </div>

        <FilterPanel onApplyFilters={handleApplyFilters} initialFilters={params} />

        <ProfessionalsList
          professionals={professionals}
          loading={loading}
          error={error}
          loadMore={loadMore}
          hasMore={hasMore}
        />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-600 text-sm">
            © {new Date().getFullYear()} Rocket4Sales Professional Talent Finder
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
