"use client";

import { useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Download, Filter, Plus, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import BookingActions from '@/components/admin/BookingActions';
import { toast } from "@/components/ui/use-toast";
import prisma from "@/lib/prisma";
import { Booking, User, Car } from "@prisma/client";

// Configuration des informations de l'entreprise (idéalement à déplacer dans un fichier de configuration)
const COMPANY_INFO = {
  name: "MaxiAuto",
  address: "27 Avenue Hassan II",
  city: "Casablanca",
  postalCode: "20000",
  country: "Maroc",
  phone: "+212 522 123 456",
  email: "contact@maxiauto.ma",
  website: "www.maxiauto.ma",
  siret: "12345678900010",
  vat: "MA123456789",
  rcs: "Casablanca B 123456",
  capital: "1 500 000 DH",
};

// Fonction pour formater les prix
const formatPrice = (price: number) => {
  return `${price.toFixed(2)} DH`;
};

interface BookingWithRelations {
  id: string;
  userId: string;
  carId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: string;
  createdAt: Date;
  user: {
    id: string;
    email: string;
  };
  car: {
    id: string;
    brand: string;
    model: string;
    image?: string;
  };
}

interface Stats {
  all: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  [key: string]: number;
}

interface BookingsClientProps {
  bookings: BookingWithRelations[];
  stats: Stats;
  currentStatus: string;
  searchQuery: string;
}

export function BookingsClient({ bookings, stats, currentStatus, searchQuery }: BookingsClientProps) {
  const router = useRouter();
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  // Ajouter un gestionnaire pour fermer le menu au clic à l'extérieur
  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.export-menu-container')) {
      setIsExportMenuOpen(false);
    }
  };

  // Générer CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Client', 'Véhicule', 'Dates', 'Prix', 'Statut', 'Date de création'];
    
    const rows = bookings.map((booking) => [
      booking.id,
      booking.user.email,
      `${booking.car.brand} ${booking.car.model}`,
      `${format(new Date(booking.startDate), 'dd/MM/yyyy')} - ${format(new Date(booking.endDate), 'dd/MM/yyyy')}`,
      `${booking.totalPrice.toFixed(2)} €`,
      booking.status,
      format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm'),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `reservations_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportMenuOpen(false);
  };

  // Générer un reçu commercial imprimable pour une réservation spécifique
  const generateReceipt = (booking: BookingWithRelations) => {
    // Formatage des données pour le reçu
    const receiptData = {
      id: booking.id,
      client: booking.user.email,
      clientId: booking.user.id,
      vehicle: `${booking.car.brand} ${booking.car.model}`,
      vehicleId: booking.car.id,
      startDate: format(new Date(booking.startDate), 'dd MMMM yyyy', { locale: fr }),
      endDate: format(new Date(booking.endDate), 'dd MMMM yyyy', { locale: fr }),
      totalDays: Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24)),
      totalPrice: booking.totalPrice.toFixed(2),
      vatRate: 20, // Taux de TVA (exemple)
      vatAmount: (booking.totalPrice * 0.2).toFixed(2), // 20% de TVA
      priceExclVat: (booking.totalPrice / 1.2).toFixed(2), // Prix HT
      status: booking.status === 'confirmed' ? 'Confirmée' : booking.status === 'pending' ? 'En attente' : 'Annulée',
      createdAt: format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm'),
      receiptNumber: `FAC-${booking.id.substring(0, 8).toUpperCase()}`,
      paymentMethod: booking.status === 'confirmed' ? 'Carte bancaire' : 'En attente de paiement', // Varie selon statut
      paymentDate: booking.status === 'confirmed' ? format(new Date(), 'dd MMMM yyyy', { locale: fr }) : 'N/A',
      today: format(new Date(), 'dd MMMM yyyy', { locale: fr }),
      reference: `RES-${booking.id.substring(0, 6).toUpperCase()}`,
    };

    // Création du HTML pour le reçu
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Facture ${receiptData.receiptNumber} - ${COMPANY_INFO.name}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          :root {
            --primary-color: #3b82f6;
            --secondary-color: #1e40af;
            --light-gray: #f9fafb;
            --border-color: #e5e7eb;
            --text-color: #374151;
            --heading-color: #1f2937;
          }
          
          body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 20px;
            color: var(--text-color);
            background-color: #f5f5f5;
          }
          
          .receipt {
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid var(--border-color);
            padding: 40px;
            background-color: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            border-radius: 8px;
          }
          
          .print-btn {
            background-color: var(--primary-color);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            font-weight: 500;
            cursor: pointer;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 100;
          }
          
          .print-btn svg {
            width: 18px;
            height: 18px;
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
            border-bottom: 2px solid var(--light-gray);
            padding-bottom: 20px;
          }
          
          .company {
            flex: 2;
          }
          
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: var(--primary-color);
            margin-bottom: 10px;
          }
          
          .company-info {
            font-size: 14px;
            color: #64748b;
          }
          
          .document-info {
            flex: 1;
            text-align: right;
          }
          
          .document-type {
            font-size: 24px;
            font-weight: bold;
            color: var(--heading-color);
            margin-bottom: 10px;
          }
          
          .receipt-number {
            font-size: 16px;
            font-weight: 500;
            color: var(--primary-color);
            margin-bottom: 5px;
          }
          
          .receipt-date {
            font-size: 14px;
            color: #64748b;
          }
          
          .parties {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
          }
          
          .address-block {
            flex: 1;
          }
          
          .address-block-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--heading-color);
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .address-details {
            font-size: 14px;
            line-height: 1.6;
          }
          
          .info-table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
          }
          
          .info-table th {
            text-align: left;
            background: var(--light-gray);
            padding: 12px 15px;
            border-top: 1px solid var(--border-color);
            border-bottom: 1px solid var(--border-color);
            font-weight: 600;
            color: var(--heading-color);
            font-size: 14px;
          }
          
          .info-table td {
            padding: 12px 15px;
            border-bottom: 1px solid var(--border-color);
            font-size: 14px;
          }
          
          .summary {
            margin-top: 40px;
            background: var(--light-gray);
            padding: 20px;
            border-radius: 8px;
          }
          
          .summary-table {
            width: 100%;
            border-collapse: collapse;
          }
          
          .summary-table td {
            padding: 8px 0;
          }
          
          .summary-table .label {
            font-weight: 500;
            color: #64748b;
          }
          
          .summary-table .value {
            text-align: right;
            font-weight: 500;
          }
          
          .summary-table .total {
            font-size: 18px;
            font-weight: 700;
            color: var(--heading-color);
          }
          
          .status {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 15px;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
          }
          
          .status.confirmed {
            background: #dcfce7;
            color: #15803d;
          }
          
          .status.pending {
            background: #fef9c3;
            color: #854d0e;
          }
          
          .status.cancelled {
            background: #fee2e2;
            color: #b91c1c;
          }
          
          .footer {
            margin-top: 40px;
            font-size: 13px;
            color: #64748b;
            text-align: center;
            border-top: 1px solid var(--border-color);
            padding-top: 20px;
          }
          
          .terms {
            margin-top: 30px;
            font-size: 13px;
            border-top: 1px dashed var(--border-color);
            padding-top: 20px;
          }
          
          .terms-title {
            font-weight: 600;
            margin-bottom: 10px;
          }
          
          @media print {
            body {
              padding: 0;
              background-color: white;
            }
            
            .receipt {
              max-width: 100%;
              border: none;
              padding: 20px;
              box-shadow: none;
              margin: 0;
              border-radius: 0;
            }
            
            .print-btn {
              display: none;
            }
            
            @page {
              size: A4;
              margin: 10mm;
            }
          }
        </style>
      </head>
      <body>
        <button class="print-btn" onclick="window.print()">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          Imprimer
        </button>
        
        <div class="receipt">
          <div class="header">
            <div class="company">
              <div class="logo">${COMPANY_INFO.name}</div>
              <div class="company-info">
                ${COMPANY_INFO.address}<br>
                ${COMPANY_INFO.postalCode} ${COMPANY_INFO.city}, ${COMPANY_INFO.country}<br>
                Tél: ${COMPANY_INFO.phone}<br>
                Email: ${COMPANY_INFO.email}<br>
                SIRET: ${COMPANY_INFO.siret}<br>
                TVA: ${COMPANY_INFO.vat}<br>
                Web: ${COMPANY_INFO.website}
              </div>
            </div>
            <div class="document-info">
              <div class="document-type">FACTURE</div>
              <div class="receipt-number">${receiptData.receiptNumber}</div>
              <div class="receipt-date">Date d'émission: ${receiptData.today}</div>
              <div class="receipt-status">
                Statut: <span class="status ${receiptData.status === 'Confirmée' ? 'confirmed' : receiptData.status === 'En attente' ? 'pending' : 'cancelled'}">${receiptData.status}</span>
              </div>
            </div>
          </div>
          
          <div class="parties">
            <div class="address-block">
              <div class="address-block-title">Facturé à</div>
              <div class="address-details">
                Client ID: ${receiptData.clientId}<br>
                Email: ${receiptData.client}<br>
                Réservation créée le: ${receiptData.createdAt}
              </div>
            </div>
            <div class="address-block">
              <div class="address-block-title">Détails du paiement</div>
              <div class="address-details">
                Méthode: ${receiptData.paymentMethod}<br>
                Date: ${receiptData.paymentDate}<br>
                Réservation ID: ${receiptData.id}<br>
                Référence: ${receiptData.reference}
              </div>
            </div>
          </div>
          
          <table class="info-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Dates</th>
                <th>Durée</th>
                <th>Montant</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Location ${receiptData.vehicle}</strong><br>
                  ID Véhicule: ${receiptData.vehicleId}
                </td>
                <td>${receiptData.startDate} au ${receiptData.endDate}</td>
                <td>${receiptData.totalDays} jour(s)</td>
                <td>${receiptData.totalPrice} DH</td>
              </tr>
              <tr>
                <td colspan="4" class="section-title">Détails de paiement</td>
              </tr>
              <tr>
                <td class="label">Prix H.T.</td>
                <td class="value">${receiptData.priceExclVat} DH</td>
              </tr>
              <tr>
                <td class="label">TVA (${receiptData.vatRate}%)</td>
                <td class="value">${receiptData.vatAmount} DH</td>
              </tr>
              <tr class="total-row">
                <td class="label">Total</td>
                <td class="value total">${receiptData.totalPrice} DH</td>
              </tr>
            </tbody>
          </table>
          
          <div class="terms">
            <div class="terms-title">Conditions et informations</div>
            <p>Merci d'avoir choisi ${COMPANY_INFO.name} pour votre location de véhicule. Ce document fait office de facture et de reçu officiel pour votre réservation.</p>
            <p>Conditions de location:</p>
            <ul>
              <li>Le règlement doit être effectué avant la prise du véhicule.</li>
              <li>Une pièce d'identité et un permis de conduire valides sont requis pour la prise du véhicule.</li>
              <li>Une caution sera demandée lors de la prise du véhicule.</li>
              <li>Le véhicule doit être restitué avec le même niveau de carburant.</li>
            </ul>
            <p>Pour toute question concernant cette facture, veuillez contacter notre service client au ${COMPANY_INFO.phone} ou par email à ${COMPANY_INFO.email}.</p>
          </div>
          
          <div class="footer">
            <p>${COMPANY_INFO.name} SAS - Capital social: ${COMPANY_INFO.capital} - ${COMPANY_INFO.rcs}</p>
            <p>Ce document est généré électroniquement et est valide sans signature.</p>
          </div>
        </div>
        
        <script>
          // Ouverture automatique de la boîte de dialogue d'impression a été déplacée au JS externe
          // L'impression est déclenchée automatiquement par le code JavaScript externe
        </script>
      </body>
      </html>
    `;

    // Ouvrir dans une nouvelle fenêtre pour impression
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptHTML);
      printWindow.document.close();
      // Déclencher automatiquement l'impression après un court délai
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } else {
      // Fallback si les popups sont bloqués
      const receiptBlob = new Blob([receiptHTML], { type: 'text/html;charset=utf-8;' });
      const receiptURL = URL.createObjectURL(receiptBlob);
      const receiptLink = document.createElement('a');
      receiptLink.setAttribute('href', receiptURL);
      receiptLink.setAttribute('download', `facture_${receiptData.receiptNumber}.html`);
      document.body.appendChild(receiptLink);
      receiptLink.click();
      document.body.removeChild(receiptLink);
      toast({
        title: "Vous devez autoriser les popups",
        description: "Pour imprimer directement le reçu, veuillez autoriser les popups dans votre navigateur.",
        variant: "destructive"
      });
    }
  };

  // Générer un rapport PDF pour toutes les réservations
  const generateReport = () => {
    // Calculer le total des revenus
    const totalRevenue = bookings.reduce((sum, booking) => {
      if (booking.status === 'confirmed') {
        return sum + booking.totalPrice;
      }
      return sum;
    }, 0);

    // Compter les réservations par statut
    const pendingCount = bookings.filter(b => b.status === 'pending').length;
    const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
    const cancelledCount = bookings.filter(b => b.status === 'cancelled').length;

    // Créer tableau des réservations pour le rapport
    const bookingsTable = bookings.map(booking => `
      <tr>
        <td>${booking.id}</td>
        <td>${booking.user.email}</td>
        <td>${booking.car.brand} ${booking.car.model}</td>
        <td>${format(new Date(booking.startDate), 'dd/MM/yyyy')} - ${format(new Date(booking.endDate), 'dd/MM/yyyy')}</td>
        <td>${formatPrice(booking.totalPrice)}</td>
        <td>
          <span class="status ${booking.status === 'confirmed' ? 'confirmed' : booking.status === 'pending' ? 'pending' : 'cancelled'}">
            ${booking.status === 'confirmed' ? 'Confirmée' : booking.status === 'pending' ? 'En attente' : 'Annulée'}
          </span>
        </td>
      </tr>
    `).join('');

    // Création du HTML pour le rapport
    const reportHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Rapport des réservations - ${format(new Date(), 'dd/MM/yyyy')}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
          .report { max-width: 1200px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #3b82f6; }
          .title { font-size: 22px; margin: 10px 0; }
          .subtitle { font-size: 16px; color: #666; }
          
          .stats-container { display: flex; justify-content: space-between; margin: 20px 0; }
          .stat-card { background: #f9fafb; padding: 15px; border-radius: 5px; flex: 1; margin: 0 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
          .stat-card:first-child { margin-left: 0; }
          .stat-card:last-child { margin-right: 0; }
          .stat-title { font-size: 14px; color: #666; margin-bottom: 5px; }
          .stat-value { font-size: 24px; font-weight: bold; }
          .stat-value.revenue { color: #15803d; }
          
          .bookings-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .bookings-table th { text-align: left; background: #f9fafb; padding: 10px; }
          .bookings-table td { padding: 10px; border-top: 1px solid #eee; }
          
          .status { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
          .status.confirmed { background: #dcfce7; color: #15803d; }
          .status.pending { background: #fef9c3; color: #854d0e; }
          .status.cancelled { background: #fee2e2; color: #b91c1c; }
          
          .footer { margin-top: 30px; font-size: 12px; text-align: center; color: #666; }
          
          @media print {
            body { padding: 0; }
            .report { max-width: none; }
          }
        </style>
      </head>
      <body>
        <div class="report">
          <div class="header">
            <div class="logo">CarRental</div>
            <h1 class="title">Rapport des réservations</h1>
            <div class="subtitle">Généré le ${format(new Date(), 'dd MMMM yyyy à HH:mm', { locale: fr })}</div>
          </div>
          
          <div class="stats-container">
            <div class="stat-card">
              <div class="stat-title">Total des réservations</div>
              <div class="stat-value">${bookings.length}</div>
            </div>
            <div class="stat-card">
              <div class="stat-title">En attente</div>
              <div class="stat-value">${pendingCount}</div>
            </div>
            <div class="stat-card">
              <div class="stat-title">Confirmées</div>
              <div class="stat-value">${confirmedCount}</div>
            </div>
            <div class="stat-card">
              <div class="stat-title">Annulées</div>
              <div class="stat-value">${cancelledCount}</div>
            </div>
            <div class="stat-card">
              <div class="stat-title">Revenus totaux</div>
              <div class="stat-value revenue">${formatPrice(totalRevenue)}</div>
            </div>
          </div>
          
          <h2>Liste des réservations</h2>
          <table class="bookings-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Véhicule</th>
                <th>Dates</th>
                <th>Prix</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              ${bookingsTable}
            </tbody>
          </table>
          
          <div class="footer">
            <p>Ce rapport a été généré automatiquement par le système CarRental.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Conversion du HTML en Blob
    const reportBlob = new Blob([reportHTML], { type: 'text/html;charset=utf-8;' });
    const reportURL = URL.createObjectURL(reportBlob);
    
    // Téléchargement du fichier HTML
    const reportLink = document.createElement('a');
    reportLink.setAttribute('href', reportURL);
    reportLink.setAttribute('download', `rapport_reservations_${format(new Date(), 'yyyy-MM-dd')}.html`);
    document.body.appendChild(reportLink);
    reportLink.click();
    document.body.removeChild(reportLink);
    setIsExportMenuOpen(false);
  };

  // Gérer le changement de statut
  const handleStatusChange = (status: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('status', status);
    router.push(url.toString());
  };

  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'pending', label: 'En attente' },
    { value: 'confirmed', label: 'Confirmées' },
    { value: 'cancelled', label: 'Annulées' },
  ];

  return (
    <div onClick={handleClickOutside}>
      <div className="flex flex-wrap items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Gestion des réservations</h1>
        
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Link
            href="/admin/bookings/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Nouvelle réservation
          </Link>
          
          <div className="relative export-menu-container">
            <button
              onClick={(e) => {
                e.stopPropagation(); // Empêcher la propagation pour éviter que handleClickOutside ne s'active
                setIsExportMenuOpen(!isExportMenuOpen);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Download className="h-4 w-4" />
              Exporter
            </button>
            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                <div className="py-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Empêcher la propagation
                      handleExportCSV();
                    }}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Exporter en CSV
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Empêcher la propagation
                      generateReport();
                    }}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Générer un rapport
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            <RefreshCw className="h-4 w-4" />
            Réinitialiser
          </Link>
        </div>
      </div>

      {/* Filtres et statistiques */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex-grow max-w-md">
            <form className="relative" method="GET">
              <input
                type="text"
                name="search"
                placeholder="Rechercher par client ou véhicule..."
                className="pl-12 pr-4 py-3 border border-blue-200 focus:border-blue-500 rounded-lg w-full bg-blue-50/50 focus:bg-white transition-all shadow-sm focus:shadow focus:outline-none"
                defaultValue={searchQuery}
              />
              <button
                type="submit"
                className="absolute left-0 top-0 h-full px-3 text-blue-500 hover:text-blue-700 transition-colors"
              >
                <Filter className="h-5 w-5" />
              </button>
            </form>
          </div>
          
          <div>
            <form className="flex items-center gap-2">
              <label htmlFor="status" className="text-sm font-medium text-gray-700">
                Statut:
              </label>
              <select
                id="status"
                name="status"
                className="rounded-lg border-blue-200 bg-blue-50/50 focus:bg-white focus:border-blue-500 shadow-sm py-3 px-4 text-gray-700 font-medium transition-all focus:outline-none focus:shadow"
                defaultValue={currentStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({stats[option.value]})
                  </option>
                ))}
              </select>
            </form>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statusOptions.map((option) => (
            <Link
              key={option.value}
              href={`/admin/bookings?status=${option.value}`}
              className={`block p-4 rounded-lg border ${
                currentStatus === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <p className="text-sm text-gray-500">{option.label}</p>
              <p className="text-2xl font-bold mt-1">
                {stats[option.value]}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Tableau des réservations */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Véhicule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates de location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de création
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reçu
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-3">
                          <img
                            className="h-10 w-10 rounded object-cover"
                            src={booking.car.image || '/placeholder-car.jpg'}
                            alt={`${booking.car.brand} ${booking.car.model}`}
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.car.brand} {booking.car.model}
                          </div>
                          <div className="text-sm text-gray-500">
                            <Link
                              href={`/admin/cars/${booking.car.id}`}
                              className="hover:underline text-blue-600"
                            >
                              Voir le véhicule
                            </Link>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(booking.startDate), 'dd MMM yyyy', { locale: fr })} -
                      <br />
                      {format(new Date(booking.endDate), 'dd MMM yyyy', { locale: fr })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatPrice(booking.totalPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {booking.status === 'confirmed'
                          ? 'Confirmée'
                          : booking.status === 'pending'
                          ? 'En attente'
                          : 'Annulée'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => generateReceipt(booking)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Reçu
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <BookingActions booking={booking} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    Aucune réservation trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 