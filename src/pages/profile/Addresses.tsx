import useAxiosGet from '@/hooks/useAxiosGet';
import useToggle from '@/hooks/useToggle';
import { Address } from '@/models/address.model';
import TheAddressModal from '@/pages/profile/components/TheAddressModal';
import { Button, Loader } from '@mantine/core';
import { useEffect, useState } from 'react';

const Addresses = () => {
  const {
    fetchData: fetchAddresses,
    data: addressList,
    errorMessage,
    isLoading
  } = useAxiosGet<Address[]>();

  const [addressId, setAddressId] = useState<number | null>(null);

  const { value: isAddressModalOpen, toggle: toggleAddressModal } =
    useToggle(false);

  useEffect(() => {
    fetchAddresses({ url: '/addresses' });
  }, []);

  const handleAddressModalClose = (shouldRefresh: boolean = false) => {
    if (shouldRefresh) {
      fetchAddresses({ url: '/addresses' });
    }
    setAddressId(null);
  };

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader variant="bars" />
      </div>
    );
  }

  return (
    <div>
      {addressList &&
        addressList.map(address => (
          <div
            key={address.id}
            onClick={() => {
              setAddressId(address.id);
              toggleAddressModal();
            }}
          >
            <div>{address.id}</div>
            <div>{address.name}</div>
          </div>
        ))}
      <Button onClick={toggleAddressModal}>New Address</Button>

      <TheAddressModal
        isAddressModalOpen={isAddressModalOpen}
        toggleAddressModal={toggleAddressModal}
        addressId={addressId}
        handleAddressModalClose={handleAddressModalClose}
      />
    </div>
  );
};

export default Addresses;
