"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarClock,
  Fuel,
  Car as CarIcon,
  Users,
  MapPin,
  CreditCard,
  Shield,
  CheckCircle2
} from "lucide-react";

// Car type definition to replace 'any'
interface Car {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  specs: {
    seats: number;
    doors: number;
    transmission: string;
    fuelType: string;
  }
}

// Temporary mock data - in a real app this would come from an API
const carsData: Car[] = [
  {
    id: "1",
    name: "Tesla Model 3",
    category: "Electric",
    price: 89,
    image: "https://same-assets.com/3da9e3ddce17a2ff8dfff77f56db8a44-image.png",
    specs: {
      seats: 5,
      doors: 4,
      transmission: "Automatic",
      fuelType: "Electric",
    }
  },
  {
    id: "2",
    name: "BMW X5",
    category: "SUV",
    price: 120,
    image: "https://same-assets.com/f0c9dbbf7e7c02a15f2e73b0e93ef64d-image.png",
    specs: {
      seats: 7,
      doors: 5,
      transmission: "Automatic",
      fuelType: "Diesel",
    }
  },
  // More cars would be here in a real implementation
];

export default function NewBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get query parameters
  const carId = searchParams.get("carId");
  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");
  const pickupLocationParam = searchParams.get("pickupLocation");
  const returnLocationParam = searchParams.get("returnLocation");

  // Form state
  const [car, setCar] = useState<Car | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [pickupLocation, setPickupLocation] = useState("");
  const [returnLocation, setReturnLocation] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [additionalRequirements, setAdditionalRequirements] = useState("");
  const [includePremiumInsurance, setIncludePremiumInsurance] = useState(false);
  const [includeGPS, setIncludeGPS] = useState(false);
  const [includeChildSeat, setIncludeChildSeat] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");

  // Load car data and populate form from query params
  useEffect(() => {
    if (carId) {
      const foundCar = carsData.find(c => c.id === carId);
      if (foundCar) {
        setCar(foundCar);
      }
    }

    if (startDateParam) {
      setStartDate(new Date(startDateParam));
    }

    if (endDateParam) {
      setEndDate(new Date(endDateParam));
    }

    if (pickupLocationParam) {
      setPickupLocation(decodeURIComponent(pickupLocationParam));
    }

    if (returnLocationParam) {
      setReturnLocation(decodeURIComponent(returnLocationParam));
    }
  }, [carId, startDateParam, endDateParam, pickupLocationParam, returnLocationParam]);

  // Calculate rental days
  const calculateTotalDays = () => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1; // Minimum 1 day
  };

  // Calculate costs
  const calculateBaseCost = () => {
    if (!car) return 0;
    return calculateTotalDays() * car.price;
  };

  const calculateInsuranceCost = () => {
    if (!includePremiumInsurance) return 0;
    return calculateTotalDays() * 15; // $15 per day for premium insurance
  };

  const calculateAddonsCost = () => {
    let total = 0;
    if (includeGPS) total += calculateTotalDays() * 5; // $5 per day for GPS
    if (includeChildSeat) total += calculateTotalDays() * 8; // $8 per day for child seat
    return total;
  };

  const calculateTotalCost = () => {
    return calculateBaseCost() + calculateInsuranceCost() + calculateAddonsCost();
  };

  // Form validation
  const isFormValid = () => {
    return (
      car &&
      startDate &&
      endDate &&
      pickupLocation &&
      returnLocation &&
      fullName &&
      email &&
      phone
    );
  };

  // Handle form submission
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert("Please fill in all required fields");
      return;
    }

    // In a real app, this would submit to an API
    // For now, we'll just simulate success and redirect

    // Create a booking object that would be sent to the API
    const bookingData = {
      carId: car?.id,
      startDate,
      endDate,
      pickupLocation,
      returnLocation,
      customer: {
        fullName,
        email,
        phone
      },
      additionalRequirements,
      addons: {
        premiumInsurance: includePremiumInsurance,
        gps: includeGPS,
        childSeat: includeChildSeat
      },
      paymentMethod,
      totalCost: calculateTotalCost(),
      status: "confirmed"
    };

    console.log("Booking submitted:", bookingData);

    // Redirect to confirmation page (in a real app this would include booking ID)
    router.push("/client/booking/confirmation?success=true");
  };

  // If car not found or missing required params
  if (!car || !startDate || !endDate) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Incomplete Booking Information</h1>
        <p className="mb-8">Some required information is missing. Please select a car and dates first.</p>
        <Button asChild>
          <Link href="/client/cars">Browse Cars</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Compléter Votre Réservation</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form - 2/3 width on large screens */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmitBooking} className="space-y-8">
            {/* Trip Details Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Détails du Voyage</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de Prise en Charge
                    </label>
                    <Input
                      type="date"
                      value={startDate ? startDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => setStartDate(new Date(e.target.value))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de Retour
                    </label>
                    <Input
                      type="date"
                      value={endDate ? endDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => setEndDate(new Date(e.target.value))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lieu de Prise en Charge
                    </label>
                    <Input
                      placeholder="Entrez le lieu de prise en charge"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lieu de Retour
                    </label>
                    <Input
                      placeholder="Entrez le lieu de retour"
                      value={returnLocation}
                      onChange={(e) => setReturnLocation(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Informations Personnelles</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom Complet
                    </label>
                    <Input
                      placeholder="Entrez votre nom complet"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="Entrez votre email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Numéro de Téléphone
                    </label>
                    <Input
                      placeholder="Entrez votre numéro de téléphone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add-ons Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Options Supplémentaires</h2>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="premium-insurance"
                      checked={includePremiumInsurance}
                      onChange={(e) => setIncludePremiumInsurance(e.target.checked)}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <label htmlFor="premium-insurance" className="font-medium">
                        Assurance Premium (+15€/jour)
                      </label>
                      <p className="text-sm text-gray-500">
                        Couverture sans franchise pour une tranquillité totale
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="gps"
                      checked={includeGPS}
                      onChange={(e) => setIncludeGPS(e.target.checked)}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <label htmlFor="gps" className="font-medium">
                        GPS (+5€/jour)
                      </label>
                      <p className="text-sm text-gray-500">
                        Restez sur le bon chemin avec notre système GPS premium
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="child-seat"
                      checked={includeChildSeat}
                      onChange={(e) => setIncludeChildSeat(e.target.checked)}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <label htmlFor="child-seat" className="font-medium">
                        Siège Enfant (+8€/jour)
                      </label>
                      <p className="text-sm text-gray-500">
                        Siège enfant homologué pour les tout-petits
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Mode de Paiement</h2>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="credit-card"
                      name="payment-method"
                      value="credit-card"
                      checked={paymentMethod === "credit-card"}
                      onChange={() => setPaymentMethod("credit-card")}
                      className="mr-3"
                    />
                    <label htmlFor="credit-card">
                      <span className="font-medium">Carte de Crédit</span>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="paypal"
                      name="payment-method"
                      value="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={() => setPaymentMethod("paypal")}
                      className="mr-3"
                    />
                    <label htmlFor="paypal">
                      <span className="font-medium">PayPal</span>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="pay-at-pickup"
                      name="payment-method"
                      value="pay-at-pickup"
                      checked={paymentMethod === "pay-at-pickup"}
                      onChange={() => setPaymentMethod("pay-at-pickup")}
                      className="mr-3"
                    />
                    <label htmlFor="pay-at-pickup">
                      <span className="font-medium">Payer à la Prise en Charge</span>
                    </label>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-gray-500">
                    Vos informations de paiement sont traitées de manière sécurisée. Aucun prélèvement ne sera effectué avant la prise en charge.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="text-right">
              <Button type="submit" size="lg" disabled={!isFormValid()}>
                Confirmer la Réservation
              </Button>
            </div>
          </form>
        </div>

        {/* Booking Summary - 1/3 width on large screens */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Récapitulatif de la Réservation</h2>

            {/* Selected Car */}
            <div className="flex items-center mb-6">
              <div className="relative h-16 w-24 rounded bg-gray-100 overflow-hidden">
                <Image
                  src={car.image}
                  alt={car.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="ml-4">
                <h3 className="font-bold">{car.name}</h3>
                <span className="text-sm text-gray-500">{car.category}</span>
              </div>
            </div>

            {/* Trip Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start">
                <CalendarClock size={18} className="text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Période de Location</p>
                  <p className="font-medium">
                    {startDate?.toLocaleDateString()} au {endDate?.toLocaleDateString()} ({calculateTotalDays()} jours)
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin size={18} className="text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Lieu de Prise en Charge</p>
                  <p className="font-medium">{pickupLocation}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin size={18} className="text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Lieu de Retour</p>
                  <p className="font-medium">{returnLocation}</p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Cost Breakdown */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Tarif de Base ({calculateTotalDays()} jours)</span>
                <span>{calculateBaseCost()}€</span>
              </div>

              {includePremiumInsurance && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Assurance Premium</span>
                  <span>+{calculateInsuranceCost()}€</span>
                </div>
              )}

              {includeGPS && (
                <div className="flex justify-between">
                  <span className="text-gray-600">GPS</span>
                  <span>+{calculateTotalDays() * 5}€</span>
                </div>
              )}

              {includeChildSeat && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Siège Enfant</span>
                  <span>+{calculateTotalDays() * 8}€</span>
                </div>
              )}

              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{calculateTotalCost()}€</span>
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-500 space-y-2">
              <div className="flex items-start">
                <CheckCircle2 size={16} className="text-green-500 mr-2 mt-0.5" />
                <span>Annulation gratuite jusqu'à 48 heures avant la prise en charge</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 size={16} className="text-green-500 mr-2 mt-0.5" />
                <span>Pas de frais cachés</span>
              </div>
              <div className="flex items-start">
                <Shield size={16} className="text-green-500 mr-2 mt-0.5" />
                <span>Traitement sécurisé des paiements</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
