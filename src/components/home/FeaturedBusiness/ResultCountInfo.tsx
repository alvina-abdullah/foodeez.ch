export default function ResultCountInfo({
    visibleCount,
    totalCount,
    selectedFoodType,
    selectedCategory,
  }: {
    visibleCount: number;
    totalCount: number;
    selectedFoodType: string;
    selectedCategory: string;
  }) {
    let filterLabel = '';
    if (selectedFoodType !== 'All') filterLabel = selectedFoodType;
    if (selectedCategory)
      filterLabel = filterLabel
        ? `${filterLabel}, ${selectedCategory}`
        : selectedCategory;
  
    return (
      <div className="text-left mb-4 px-2">
        <p className="text-2xl font-bold ">
          Showing <span className="text-primary">{visibleCount}</span> of{' '}
          <span className="text-primary">{totalCount}</span> results
          {filterLabel && (
            <>
              {' '}
              for{' '}
              <span className="text-accent font-semibold">"{filterLabel}"</span>
            </>
          )}
        </p>
      </div>
    );
  }
  