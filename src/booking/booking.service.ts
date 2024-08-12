import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { parseStringPromise } from 'xml2js';

@Injectable()
export class BookingService {
  async getBookingData(confirmationNo: string) {
    const filePath = path.join(
      __dirname,
      '../../../src/booking/xml',
      `booking_${confirmationNo}.xml`,
    );

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Booking not found');
    }

    const xmlData = fs.readFileSync(filePath, 'utf-8');

    // Chuyển đổi XML sang JSON bằng cách sử dụng thư viện
    const jsonDataWithLibrary = await this.convertXmlToJsonWithLibrary(xmlData);

    // Chuyển đổi XML sang JSON không sử dụng thư viện
    const jsonDataWithoutLibrary = this.convertXmlToJsonWithoutLibrary(xmlData);
    console.log('🚀 ~ jsonDataWithoutLibrary:', jsonDataWithoutLibrary);

    return {
      withLibrary: jsonDataWithLibrary,
      withoutLibrary: jsonDataWithoutLibrary,
    };
  }

  // Chuyển đổi XML sang JSON sử dụng thư viện
  private async convertXmlToJsonWithLibrary(xml: string): Promise<any> {
    try {
      const result = await parseStringPromise(xml, {
        explicitArray: false,
        ignoreAttrs: true,
      });
      const booking =
        result['soap:Envelope']['soap:Body']['FetchBookingResponse'][
          'HotelReservation'
        ];
      const profile =
        booking['r:ResGuests']['r:ResGuest']['r:Profiles']['Profile'];

      // Check if profile and customer data exists
      const customer =
        profile && profile['Customer'] ? profile['Customer'] : null;

      return {
        confirmation_no: booking['r:UniqueIDList']['c:UniqueID'][0]['_'],
        resv_name_id: booking['r:UniqueIDList']['c:UniqueID'][1]['_'],
        arrival:
          booking['r:RoomStays']['hc:RoomStay']['hc:TimeSpan']['hc:StartDate'],
        departure:
          booking['r:RoomStays']['hc:RoomStay']['hc:TimeSpan']['hc:EndDate'],
        adults:
          booking['r:RoomStays']['hc:RoomStay']['hc:GuestCounts'][
            'hc:GuestCount'
          ][0]['count'],
        children:
          booking['r:RoomStays']['hc:RoomStay']['hc:GuestCounts'][
            'hc:GuestCount'
          ][1]['count'],
        roomtype:
          booking['r:RoomStays']['hc:RoomStay']['hc:RoomTypes']['hc:RoomType'][
            'roomTypeCode'
          ],
        ratecode:
          booking['r:RoomStays']['hc:RoomStay']['hc:RatePlans']['hc:RatePlan'][
            'ratePlanCode'
          ],
        rateamount: {
          amount:
            booking['r:RoomStays']['hc:RoomStay']['hc:RoomRates'][
              'hc:RoomRate'
            ]['hc:Rates']['hc:Rate']['hc:Base']['_'],
          currency:
            booking['r:RoomStays']['hc:RoomStay']['hc:RoomRates'][
              'hc:RoomRate'
            ]['hc:Rates']['hc:Rate']['hc:Base']['currencyCode'],
        },
        guarantee:
          booking['r:RoomStays']['hc:RoomStay']['hc:Guarantee'][
            'guaranteeType'
          ],
        method_payment:
          booking['r:RoomStays']['hc:RoomStay']['hc:Payment'][
            'hc:PaymentsAccepted'
          ]['hc:PaymentType']['hc:OtherPayment']['type'],
        computed_resv_status: booking['reservationStatus'],
        last_name: customer ? customer['PersonName']['c:lastName'] : null,
        first_name: customer ? customer['PersonName']['c:firstName'] : null,
        title:
          customer && customer['PersonName']['title']
            ? customer['PersonName']['title']
            : 'Mr',
        phone_number:
          customer && customer['Phones']
            ? customer['Phones']['NamePhone']['c:PhoneNumber']
            : null,
        email:
          customer && customer['Emails'] ? customer['Emails']['Email'] : null,
        booking_balance: booking['r:RoomStays']['hc:RoomStay']['hc:Total']['_'],
        booking_created_date: booking['r:ReservationHistory']['insertDate'],
      };
    } catch (error) {
      console.error('Error parsing XML', error);
      throw error;
    }
  }

  private async convertXmlToJsonWithoutLibrary(xml: string): Promise<any> {
    try {
      const getValueBetweenTags = (
        xml: string,
        tagName: string,
      ): string | null => {
        const regex = new RegExp(`<${tagName}>(.*?)</${tagName}>`, 's');
        const match = xml.match(regex);
        return match ? match[1].trim() : null;
      };

      const getAttributeValue = (
        xmlString: string,
        tagName: string,
        attribute: string,
      ): string | null => {
        const regex = new RegExp(
          `<${tagName} [^>]*${attribute}="([^"]*)".*?>`,
          's',
        );
        const match = xmlString.match(regex);
        return match ? match[1] : null;
      };

      const booking = getValueBetweenTags(xml, 'HotelReservation');
      const profile = booking ? getValueBetweenTags(booking, 'Profile') : null;
      const customer = profile
        ? getValueBetweenTags(profile, 'Customer')
        : null;

      return {
        confirmation_no:
          getAttributeValue(booking || '', 'c:UniqueID', 'ID') || '',
        resv_name_id:
          getAttributeValue(booking || '', 'c:UniqueID', 'ID') || '',
        arrival: getValueBetweenTags(booking || '', 'hc:StartDate') || '',
        departure: getValueBetweenTags(booking || '', 'hc:EndDate') || '',
        adults:
          getAttributeValue(booking || '', 'hc:GuestCount', 'count') || '',
        children:
          getAttributeValue(booking || '', 'hc:GuestCount', 'count') || '',
        roomtype:
          getAttributeValue(booking || '', 'hc:RoomType', 'roomTypeCode') || '',
        ratecode:
          getAttributeValue(booking || '', 'hc:RatePlan', 'ratePlanCode') || '',
        rateamount: {
          amount: getValueBetweenTags(booking || '', 'hc:Base') || '',
          currency:
            getAttributeValue(booking || '', 'hc:Base', 'currencyCode') || '',
        },
        guarantee:
          getAttributeValue(booking || '', 'hc:Guarantee', 'guaranteeType') ||
          '',
        method_payment:
          getAttributeValue(booking || '', 'hc:OtherPayment', 'type') || '',
        computed_resv_status:
          getValueBetweenTags(booking || '', 'reservationStatus') || '',
        last_name: customer
          ? getValueBetweenTags(customer, 'c:lastName') || ''
          : '',
        first_name: customer
          ? getValueBetweenTags(customer, 'c:firstName') || ''
          : '',
        title: customer ? getValueBetweenTags(customer, 'title') || 'Mr' : 'Mr',
        phone_number: customer
          ? getValueBetweenTags(customer, 'c:PhoneNumber') || ''
          : '',
        email: customer ? getValueBetweenTags(customer, 'Email') || '' : '',
        booking_balance: getValueBetweenTags(booking || '', 'hc:Total') || '',
        booking_created_date:
          getValueBetweenTags(booking || '', 'insertDate') || '',
      };
    } catch (error) {
      console.error('Error parsing XML', error);
      throw error;
    }
  }
}
