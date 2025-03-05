import React, { useState, useEffect } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useSelector } from "react-redux";
import { ICON } from "../../constants/icons";
import { API_URL } from "../../api/routes";
import { useForm, Controller } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { updateUserProfileAsync } from "../../feature/user/userSlice";
import toast from "react-hot-toast";

const countryOptions = Country.getAllCountries().map((c) => ({
  value: c.isoCode,
  label: c.name,
  dialCode: c.phonecode,
}));

function ViewProfile() {
  const dispatch = useDispatch();
  const { currentUser: loggedInUser } = useSelector((state) => state.auth);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(
    `${API_URL}${loggedInUser.profilePicture}` || null
  );
  const [countryCode, setCountryCode] = useState(
    loggedInUser?.address?.countryCode || ""
  );
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // Toggle function for password field
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Toggle function for confirm password field
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors, touchedFields, isSubmitting },
    setError,
    clearErrors,
    reset,
    formState,
  } = useForm({
    defaultValues: {
      username: loggedInUser.username || "",
      name: loggedInUser.name || "",
      email: loggedInUser.email || "",
      mobile: loggedInUser.mobile
        ? `+${loggedInUser.address?.countryCode || "91"}${loggedInUser.mobile}`
        : "",
      address: {
        line1: loggedInUser.address?.line1 || "",
        line2: loggedInUser.address?.line2 || "",
        city: loggedInUser.address?.city || "",
        state: loggedInUser.address?.state || "",
        country: loggedInUser.address?.country || "",
      },
      dob: loggedInUser.dob ? loggedInUser.dob.split("T")[0] : "",
      gender: loggedInUser.gender || "",
    },
    mode: "onBlur",
  });

  const selectedCountry = watch("country");

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (data) => {
    console.log("Submitting data:", data);
    const formData = new FormData();

    // Append user details
    formData.append("username", data.username);
    formData.append("name", data.name);
    formData.append("email", data.email);
    if (data.mobile) {
      const number = data.mobile.replace(`${countryCode}`, "");
      console.log("number", number);
      formData.append("mobile", number);
    }
    formData.append("gender", data.gender);
    formData.append("dob", data.dob);
    // Append address fields
    formData.append("address.line1", data.address.line1);
    formData.append("address.line2", data.address.line2);
    formData.append("address.state", JSON.stringify(data.address.state));
    formData.append("address.city", JSON.stringify(data.address.city));
    formData.append("address.country", JSON.stringify(data.address.country));
    if (countryCode) {
      formData.append("address.countryCode", countryCode);
    } else {
      formData.append("address.countryCode", data.address.country.dialCode);
    }
    if (image) {
      console.log("image selected...");
      formData.append("avatar", image);
    }

    // console.log("Final FormData before sending:");
    // for (let pair of formData.entries()) {
    //     console.log(pair[0], pair[1]);
    // }

    try {
      await dispatch(updateUserProfileAsync(formData)).unwrap();
    } catch (error) {
      toast.error(error || "Server error");
    }
  };

  // Fetch states when country changes
  useEffect(() => {
    if (selectedCountry) {
      const states = State.getStatesOfCountry(selectedCountry.value).map(
        (s) => ({
          value: s.isoCode,
          label: s.name,
        })
      );
      setStateOptions(states);
      setCityOptions([]);
    }
  }, [selectedCountry]);

  // console.log("countryCode", countryCode);
  // console.log(formState.errors);
  return (
    <MasterLayout>
      <Breadcrumb title="View Profile" />
      <div className="row gy-4">
        <div className="col-lg-4">
          <div className="user-grid-card position-relative border radius-16 overflow-hidden bg-base h-100">
            {loggedInUser.profilePicture ? (
              <div
                className="w-100 h-52 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${API_URL}${loggedInUser.profilePicture})`,
                }}
              ></div>
            ) : (
              <div className="w-100 h-52 object-fit-cover bg-gray-500"></div>
            )}
            <div className="pb-24 ms-16 mb-24 me-16  mt--100">
              {/* User Image and Name section */}
              <div className="text-center border border-top-0 border-start-0 border-end-0">
                {loggedInUser.profilePicture ? (
                  <img
                    src={`${API_URL}${loggedInUser.profilePicture}`}
                    alt=""
                    className="border br-white border-width-2-px w-200-px h-200-px rounded-circle "
                  />
                ) : (
                  <Icon
                    icon={ICON.DEFAULT_USER}
                    className="border br-white border-width-2-px w-200-px h-200-px rounded-circle object-fit-cover bg-gray-300"
                  />
                )}

                <h6 className="mb-0 mt-16">{loggedInUser.username}</h6>
                <span className="text-secondary-light mb-16">
                  {loggedInUser.email}
                </span>
              </div>
              <div className="mt-24">
                <h6 className="text-xl mb-16">Personal Info</h6>
                <ul>
                  <li className="d-flex align-items-center gap-1 mb-12">
                    <span className="w-30 text-md fw-semibold text-primary-light">
                      Name
                    </span>
                    <span className="w-70 text-secondary-light fw-medium">
                      {`${loggedInUser.username} ${
                        loggedInUser.name ? `(${loggedInUser.name})` : ""
                      }`}
                    </span>
                  </li>
                  <li className="d-flex align-items-center gap-1 mb-12">
                    <span className="w-30 text-md fw-semibold text-primary-light">
                      {" "}
                      Email
                    </span>
                    <span className="w-70 text-secondary-light fw-medium">
                      {loggedInUser.email || "N/A"}
                    </span>
                  </li>
                  <li className="d-flex align-items-center gap-1 mb-12">
                    <span className="w-30 text-md fw-semibold text-primary-light">
                      {" "}
                      Phone Number
                    </span>
                    <span className="w-70 text-secondary-light fw-medium">
                      {loggedInUser.mobile || "N/A"}
                    </span>
                  </li>
                  <li className="d-flex align-items-center gap-1 mb-12">
                    <span className="w-30 text-md fw-semibold text-primary-light">
                      {" "}
                      dob
                    </span>
                    <span className="w-70 text-secondary-light fw-medium">
                      {new Date(loggedInUser.dob).toISOString().split("T")[0] ||
                        "N/A"}
                    </span>
                  </li>
                  <li className="d-flex align-items-center gap-1 mb-12">
                    <span className="w-30 text-md fw-semibold text-primary-light">
                      {" "}
                      Gender
                    </span>
                    <span className="w-70 text-secondary-light fw-medium">
                      {loggedInUser.gender || "N/A"}
                    </span>
                  </li>
                  <li className="d-flex align-items-center gap-1">
                    <span className="w-30 text-md fw-semibold text-primary-light">
                      {" "}
                      Address
                    </span>
                    <span className="w-70 text-secondary-light fw-medium">
                      {loggedInUser.address?.line1 ||
                      loggedInUser.address?.line2
                        ? [
                            loggedInUser.address?.line1,
                            loggedInUser.address?.line2,
                          ]
                            .filter(Boolean)
                            .join(", ")
                        : "N/A"}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card h-100">
            <div className="card-body p-24">
              <ul
                className="nav border-gradient-tab nav-pills mb-20 d-inline-flex"
                id="pills-tab"
                role="tablist"
              >
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link d-flex align-items-center px-24 active"
                    id="pills-edit-profile-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-edit-profile"
                    type="button"
                    role="tab"
                    aria-controls="pills-edit-profile"
                    aria-selected="true"
                  >
                    Edit Profile
                  </button>
                </li>
                {/* <li className="nav-item" role="presentation">
                  <button
                    className="nav-link d-flex align-items-center px-24"
                    id="pills-change-passwork-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-change-passwork"
                    type="button"
                    role="tab"
                    aria-controls="pills-change-passwork"
                    aria-selected="false"
                    tabIndex={-1}
                  >
                    Change Password
                  </button>
                </li> */}
                {/* <li className="nav-item" role="presentation">
                  <button
                    className="nav-link d-flex align-items-center px-24"
                    id="pills-notification-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-notification"
                    type="button"
                    role="tab"
                    aria-controls="pills-notification"
                    aria-selected="false"
                    tabIndex={-1}
                  >
                    Notification Settings
                  </button>
                </li> */}
              </ul>
              <div className="tab-content" id="pills-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="pills-edit-profile"
                  role="tabpanel"
                  aria-labelledby="pills-edit-profile-tab"
                  tabIndex={0}
                >
                  <h6 className="text-md text-primary-light mb-16">
                    Profile Image
                  </h6>
                  {/* Upload Image Start */}
                  <div className="mb-24 mt-16">
                    {/* User avatar */}
                    <div className="avatar-upload">
                      <div className="avatar-edit position-absolute bottom-0 end-0 me-24 mt-16 z-1 cursor-pointer">
                        <input
                          type="file"
                          id="imageUpload"
                          accept=".png, .jpg, .jpeg"
                          hidden
                          onChange={handleImageChange}
                        />
                        <label
                          htmlFor="imageUpload"
                          className="w-32-px h-32-px d-flex justify-content-center align-items-center bg-primary-50 text-primary-600 border border-primary-600 bg-hover-primary-100 text-lg rounded-circle"
                        >
                          <Icon
                            icon="solar:camera-outline"
                            className="icon"
                          ></Icon>
                        </label>
                      </div>
                      <div className="avatar-preview">
                        <div className="bg-cover bg-center w-full flex items-center justify-center">
                          {preview ? (
                            <img
                              src={preview}
                              alt="Preview"
                              className="w-full h-full bg-gray-200 rounded-full object-center"
                            />
                          ) : (
                            <Icon
                              icon={ICON.DEFAULT_USER}
                              className="object-cover text-gray-500 w-full h-full bg-gray-200 rounded-full"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Upload Image End */}
                  <form action="#" onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className="row">
                      {/* username */}
                      <div className="col-sm-6">
                        <div className="mb-20">
                          <label
                            htmlFor="username"
                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                          >
                            Username
                          </label>
                          <input
                            id="username"
                            type="text"
                            className="form-control radius-8"
                            placeholder="Enter Full Name"
                            disabled
                            {...register("username", {
                              required: "username is required",
                            })}
                          />

                          {errors.username && (
                            <p className="error-message">
                              {errors.username.message}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* name */}
                      <div className="col-sm-6">
                        <div className="mb-20">
                          <label
                            htmlFor="name"
                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                          >
                            Name
                          </label>
                          <input
                            id="name"
                            type="text"
                            className="form-control radius-8"
                            placeholder="Enter Your Name"
                            {...register("name")}
                          />

                          {errors.name && (
                            <p className="error-message">
                              {errors.name.message}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* Email */}
                      <div className="col-sm-6">
                        <div className="mb-20">
                          <label
                            htmlFor="email"
                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                          >
                            Email
                          </label>
                          <input
                            id="email"
                            type="email"
                            className="form-control radius-8"
                            placeholder="Enter email address"
                            {...register("email", {
                              pattern: {
                                value:
                                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Invalid email format",
                              },
                            })}
                          />
                          {errors.email && (
                            <p className="error-message text-danger-600">
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* Mobile */}
                      <div className="col-sm-6">
                        <div className="mb-20 overflow-hidden">
                          <label
                            htmlFor="number"
                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                          >
                            Phone
                          </label>
                          <Controller
                            name="mobile"
                            control={control}
                            rules={{
                              // required: "Phone number is required",
                              minLength: {
                                value: 10,
                                message: "Enter a valid phone number",
                              },
                            }}
                            render={({ field }) => (
                              <PhoneInput
                                {...field}
                                inputProps={{
                                  ref: field.ref,
                                  name: field.name,
                                }}
                                country={"in"}
                                onlyCountries={["us", "in", "gb"]}
                                placeholder="Enter phone number"
                                containerClass="w-full flex !important"
                                inputClass="w-full px-5 py-2 border border-gray-300 rounded-md !important"
                                autoFormat={true}
                                // enableSearch={true}
                                onChange={(value, data) => {
                                  // console.log(value,data)
                                  const number = value.replace(
                                    `+${data.dialCode}`,
                                    ""
                                  );
                                  setCountryCode(`${data.dialCode}`);
                                  setValue("mobile", number);

                                  // Auto-select country based on phone input
                                  const matchedCountry = countryOptions.find(
                                    (c) => c.dialCode === data.dialCode
                                  );
                                  if (matchedCountry) {
                                    setValue("country", matchedCountry);
                                  }
                                }}
                              />
                            )}
                          />

                          {errors.mobile && (
                            <p className="error-message text-danger-600">
                              {errors.mobile.message}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* dob */}
                      <div className="col-sm-6">
                        <div className="mb-20">
                          <label
                            htmlFor="dob"
                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                          >
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            {...register("dob")}
                            max={new Date().toISOString().split("T")[0]} // Restrict future dates
                            className="form-control radius-8"
                          />
                          {errors.dob && (
                            <p className="error-message text-danger-600">
                              {errors.dob.message}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* Gender */}
                      <div className="col-sm-6">
                        <div className="mb-20">
                          <label
                            htmlFor="gender"
                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                          >
                            Gender
                          </label>

                          <select
                            className="form-control radius-8 form-select"
                            id="gender"
                            {...register("gender")}
                          >
                            <option value="" disabled selected>
                              Select Gender
                            </option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Others</option>
                          </select>

                          {errors.gender && (
                            <p className="error-message text-danger-600">
                              {errors.gender.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Address line1 */}
                      <div className="col-sm-6">
                        <div className="mb-20">
                          <label
                            htmlFor="line1"
                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                          >
                            Address Line 1{" "}
                          </label>

                          <input
                            id="line1"
                            type="text"
                            className="form-control radius-8"
                            placeholder="Enter Address Line 1"
                            {...register("address.line1")}
                          />

                          {errors.address?.line1 && (
                            <p className="error-message text-danger-600">
                              {errors.address.line1.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Address line2 */}
                      <div className="col-sm-6">
                        <div className="mb-20">
                          <label
                            htmlFor="line2"
                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                          >
                            Address Line 2{" "}
                          </label>

                          <input
                            id="line2"
                            type="text"
                            className="form-control radius-8"
                            placeholder="Enter Address Line 2"
                            {...register("address.line2")}
                          />

                          {errors.address?.line2 && (
                            <p className="error-message text-danger-600">
                              {errors.address.line2.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Country Select */}
                      <div className="col-sm-6">
                        <div className="mb-20">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Country
                          </label>
                          <Controller
                            name="address.country"
                            control={control}
                            // rules={{ required: "Country is required" }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                options={countryOptions}
                                placeholder="Select Country"
                                isDisabled={
                                  !getValues("mobile") || errors.mobile
                                }
                                onChange={(selectedOption) => {
                                  if (!getValues("mobile") || errors.mobile) {
                                    setError("address.country", {
                                      type: "manual",
                                      message:
                                        "Please enter a valid phone number before selecting a country.",
                                    });
                                    return;
                                  } else {
                                    clearErrors("address.country");
                                  }

                                  if (
                                    countryCode &&
                                    countryCode !== selectedOption.dialCode
                                  ) {
                                    const correctCountry = countryOptions.find(
                                      (c) => c.dialCode === countryCode
                                    );
                                    if (correctCountry) {
                                      setValue(
                                        "address.country",
                                        correctCountry
                                      );
                                    }
                                  } else {
                                    setValue("address.country", selectedOption);
                                  }

                                  setValue("address.state", null);
                                  setValue("address.city", null);
                                }}
                              />
                            )}
                          />

                          {errors?.address?.country && (
                            <p className="error-message text-danger-600">
                              {errors.address.country.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* State Select */}
                      <div className="col-sm-6">
                        <div className="mb-20">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            State
                          </label>
                          <Controller
                            name="address.state"
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                options={stateOptions}
                                placeholder="Select State"
                                isDisabled={!selectedCountry}
                                onChange={(selectedOption) => {
                                  setValue("address.state", selectedOption);
                                  setValue("address.city", null);

                                  if (
                                    selectedCountry?.value &&
                                    selectedOption?.value
                                  ) {
                                    const cities =
                                      City.getCitiesOfState(
                                        selectedCountry.value,
                                        selectedOption.value
                                      ) || [];

                                    setCityOptions(
                                      cities.map((c) => ({
                                        value: c.name,
                                        label: c.name,
                                      }))
                                    );
                                  }
                                }}
                              />
                            )}
                          />
                          {errors?.address?.state && (
                            <p className="error-message text-danger-600">
                              {errors.address.state.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* City Select */}
                      <div className="col-sm-6">
                        <div className="mb-20">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            City
                          </label>
                          <Controller
                            name="address.city"
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                options={cityOptions || []}
                                placeholder="Select City"
                                isDisabled={!watch("address.state")}
                              />
                            )}
                          />
                          {errors?.address?.city && (
                            <p className="error-message text-danger-600">
                              {errors.address.city.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      {/* <div className="col-sm-12">
                        <div className="mb-20">
                          <label
                            htmlFor="desc"
                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                          >
                            Description
                          </label>
                          <textarea
                            name="#0"
                            className="form-control radius-8"
                            id="desc"
                            placeholder="Write description..."
                            defaultValue={""}
                          />
                        </div>
                      </div> */}
                    </div>
                    <div className="d-flex align-items-center justify-content-center gap-3">
                      <button
                        type="button"
                        className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-10 py-11 sm:px-56 sm:py-11 radius-8"
                        onClick={() => reset()}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary border border-primary-600 text-md py-12 sm:px-56 sm:py-12 radius-8"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? <span>Saving...</span> : "Save"}
                      </button>
                    </div>
                  </form>
                </div>
                {/* Change Password start */}
                <div
                  className="tab-pane fade"
                  id="pills-change-passwork"
                  role="tabpanel"
                  aria-labelledby="pills-change-passwork-tab"
                  tabIndex="0"
                >
                  <div className="mb-20">
                    <label
                      htmlFor="your-password"
                      className="form-label fw-semibold text-primary-light text-sm mb-8"
                    >
                      New Password <span className="text-danger-600">*</span>
                    </label>
                    <div className="position-relative">
                      <input
                        type={passwordVisible ? "text" : "password"}
                        className="form-control radius-8"
                        id="your-password"
                        placeholder="Enter New Password*"
                      />
                      <span
                        className={`toggle-password ${
                          passwordVisible ? "ri-eye-off-line" : "ri-eye-line"
                        } cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                        onClick={togglePasswordVisibility}
                      ></span>
                    </div>
                  </div>

                  <div className="mb-20">
                    <label
                      htmlFor="confirm-password"
                      className="form-label fw-semibold text-primary-light text-sm mb-8"
                    >
                      Confirm Password{" "}
                      <span className="text-danger-600">*</span>
                    </label>
                    <div className="position-relative">
                      <input
                        type={confirmPasswordVisible ? "text" : "password"}
                        className="form-control radius-8"
                        id="confirm-password"
                        placeholder="Confirm Password*"
                      />
                      <span
                        className={`toggle-password ${
                          confirmPasswordVisible
                            ? "ri-eye-off-line"
                            : "ri-eye-line"
                        } cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                        onClick={toggleConfirmPasswordVisibility}
                      ></span>
                    </div>
                  </div>
                </div>
                {/* Notification Settings start */}
                <div
                  className="tab-pane fade"
                  id="pills-notification"
                  role="tabpanel"
                  aria-labelledby="pills-notification-tab"
                  tabIndex={0}
                >
                  <div className="form-switch switch-primary py-12 px-16 border radius-8 position-relative mb-16">
                    <label
                      htmlFor="companzNew"
                      className="position-absolute w-100 h-100 start-0 top-0"
                    />
                    <div className="d-flex align-items-center gap-3 justify-content-between">
                      <span className="form-check-label line-height-1 fw-medium text-secondary-light">
                        Company News
                      </span>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="companzNew"
                      />
                    </div>
                  </div>
                  <div className="form-switch switch-primary py-12 px-16 border radius-8 position-relative mb-16">
                    <label
                      htmlFor="pushNotifcation"
                      className="position-absolute w-100 h-100 start-0 top-0"
                    />
                    <div className="d-flex align-items-center gap-3 justify-content-between">
                      <span className="form-check-label line-height-1 fw-medium text-secondary-light">
                        Push Notification
                      </span>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="pushNotifcation"
                        defaultChecked=""
                      />
                    </div>
                  </div>
                  <div className="form-switch switch-primary py-12 px-16 border radius-8 position-relative mb-16">
                    <label
                      htmlFor="weeklyLetters"
                      className="position-absolute w-100 h-100 start-0 top-0"
                    />
                    <div className="d-flex align-items-center gap-3 justify-content-between">
                      <span className="form-check-label line-height-1 fw-medium text-secondary-light">
                        Weekly News Letters
                      </span>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="weeklyLetters"
                        defaultChecked=""
                      />
                    </div>
                  </div>
                  <div className="form-switch switch-primary py-12 px-16 border radius-8 position-relative mb-16">
                    <label
                      htmlFor="meetUp"
                      className="position-absolute w-100 h-100 start-0 top-0"
                    />
                    <div className="d-flex align-items-center gap-3 justify-content-between">
                      <span className="form-check-label line-height-1 fw-medium text-secondary-light">
                        Meetups Near you
                      </span>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="meetUp"
                      />
                    </div>
                  </div>
                  <div className="form-switch switch-primary py-12 px-16 border radius-8 position-relative mb-16">
                    <label
                      htmlFor="orderNotification"
                      className="position-absolute w-100 h-100 start-0 top-0"
                    />
                    <div className="d-flex align-items-center gap-3 justify-content-between">
                      <span className="form-check-label line-height-1 fw-medium text-secondary-light">
                        Orders Notifications
                      </span>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="orderNotification"
                        defaultChecked=""
                      />
                    </div>
                  </div>
                </div>
                {/* Notification Settings end */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
}

export default ViewProfile;
