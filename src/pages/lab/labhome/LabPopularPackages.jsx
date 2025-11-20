// src/pages/lab/labhome/LabPopularPackages.jsx
import React from 'react'
import { useSelector } from 'react-redux';
import { fetchPopularPackages } from '../../../redux/features/labSilice';

function LabPopularPackages() {
  const dispatch = useDispatch();
  const { packages, loading, pageNumber } = useSelector((state) => state.packages);
  useEffect(() => {
    dispatch(
      fetchPopularPackages({
        pageSize: 10,
        pageNumber,
        latitude,
        longitude,
        distance,
      })
    );
  }, [pageNumber]);

  const loadMore = () => {
    dispatch(nextPage());
  };
  return (
    <div>LabPopularPackages</div>
  )
}

export default LabPopularPackages