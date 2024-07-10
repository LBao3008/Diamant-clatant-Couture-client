import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";

const StatusFilter = ({ setCurrPage, shop_right = false }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const statusOptions = ["On sale", "In stock"];

  // State to track selected status options
  const [selectedStatus, setSelectedStatus] = useState([]);

  // Effect to update selected status based on router query
  useEffect(() => {
    if (router.query.status) {
      const selected = Array.isArray(router.query.status)
        ? router.query.status.map((c) =>
            c.toLowerCase().replace("&", "").split(" ").join("-")
          )
        : [
            router.query.status
              .toLowerCase()
              .replace("&", "")
              .split(" ")
              .join("-"),
          ];
      setSelectedStatus(selected);
    } else {
      setSelectedStatus([]);
    }
  }, [router.query.status]);

  // Function to handle checkbox change
  const handleCheckboxChange = (status) => {
    const normalizedStatus = status
      .toLowerCase()
      .replace("&", "")
      .split(" ")
      .join("-");
    const isChecked = selectedStatus.includes(normalizedStatus);

    // Toggle selection
    let newSelectedStatus;
    if (isChecked) {
      // Remove status if already checked
      newSelectedStatus = selectedStatus.filter((c) => c !== normalizedStatus);
    } else {
      // Add status if unchecked
      newSelectedStatus = [...selectedStatus, normalizedStatus];
    }

    setSelectedStatus(newSelectedStatus);

    // Build query parameters
    const queryParams = newSelectedStatus.map((c) => `status=${c}`).join("&");

    // Construct URL based on shop or shop-right-sidebar
    router.push(
      `/${shop_right ? "shop-right-sidebar" : "shop"}${
        queryParams ? `?${queryParams}` : ""
      }`
    );

    // Close filter sidebar
    dispatch(handleFilterSidebarClose());
  };

  return (
    <div className="tp-shop-widget mb-50">
      <h3 className="tp-shop-widget-title">Product Status</h3>
      <div className="tp-shop-widget-content">
        <div className="tp-shop-widget-checkbox">
          <ul className="filter-items filter-checkbox">
            {statusOptions.map((status, index) => (
              <li key={index} className="filter-item checkbox">
                <input
                  id={status}
                  type="checkbox"
                  checked={selectedStatus.includes(
                    status.toLowerCase().replace("&", "").split(" ").join("-")
                  )}
                  onChange={() => handleCheckboxChange(status)}
                />
                <label htmlFor={status}>{status}</label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StatusFilter;
