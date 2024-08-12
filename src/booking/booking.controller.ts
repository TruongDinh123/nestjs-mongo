import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Get(':confirmation_no')
  async getBooking(@Param('confirmation_no') confirmationNo: string) {
    return this.bookingService.getBookingData(confirmationNo);
  }
}
