import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseInterceptors,
  Param,
  Headers,
  Delete,
  Response,
  Req,
  NotFoundException,
  Inject,
} from '@nestjs/common'
import { UsersService } from './users.service'
const multer = require('multer')
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { DatabaseError, LoginFailedError } from '@src/common/error'
import { SharedLinkDataCreateDTO, SharedLinkParamGetDTO } from './user.dto'
import Helper from '@src/common/helper'
import { ExcelType } from '@src/common/enum/excelFile'
const ldap = require('ldapjs')

@Controller('users')
export class UsersController {
  constructor (private readonly usersService: UsersService) {}

  @Get('ldap')
  ldap (): string {
    const urlList = process.env.LDAP_URL_LIST.split(',')

    const client = ldap.createClient({
      url: urlList,
    })

    client.on('error', err => {
      console.log(err)
    })

    const opts = {
      filter: '(&(l=Seattle)(email=*@foo.com))',
      scope: 'sub',
      attributes: ['dn', 'sn', 'cn'],
    }

    client.search('dc=example', opts, (err, res) => {
      res.on('searchRequest', searchRequest => {
        console.log('searchRequest: ', searchRequest.messageID)
      })
      res.on('searchEntry', entry => {
        console.log('entry: ' + JSON.stringify(entry.object))
      })
      res.on('searchReference', referral => {
        console.log('referral: ' + referral.uris.join())
      })
      res.on('error', err => {
        console.error('error: ' + err.message)
      })
      res.on('end', result => {
        console.log('status: ' + result.status)
      })
    })
    return 'ldap'
  }

  @Get('profile/layout')
  getProfile (@Headers('userId') userId: string) {
    return this.usersService.getProfile({ userId, withFilePath: false })
  }

  @Patch('profile/layout')
  @UseInterceptors(
    FilesInterceptor('excelFileList', 100, {
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          if (req.headers.userid) {
            let savefilePath = `data/user/${req.headers.userid}/excel`
            cb(null, savefilePath)
          }
        },
        filename: function (req, file, cb) {
          cb(null, new Date().getTime() + '-' + file.originalname)
        },
      }),
    }),
  )
  updateProfile (
    @Body('profileData') profileData: string,
    @Headers('userId') userId: string,
  ) {
    return this.usersService.updateProfile({
      profileData: JSON.parse(profileData),
      userId,
    })
  }

  @Post('profile/layout')
  @UseInterceptors(
    FilesInterceptor('excelFileList', 100, {
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          if (req.headers.userid) {
            let savefilePath = `data/user/${req.headers.userid}/excel`
            cb(null, savefilePath)
          }
        },
        filename: function (req, file, cb) {
          cb(null, new Date().getTime() + '-' + file.originalname)
        },
      }),
    }),
  )
  saveProfile (
    @Body('profileData') profileDataString: string,
    @Headers('userId') userId: string,
  ) {
    const profileData = JSON.parse(profileDataString)

    return this.usersService.saveProfile({
      profileData: profileData,
      userId,
    })
  }

  @Delete('profile/:profileName')
  async deleteProfile (
    @Param('profileName') profileName: string,
    @Headers('userId') userId: string,
  ) {
    await this.usersService.deleteProfile({ userId, profileName })
    return Helper.parseResponseBody({ data: '' })
  }

  @Patch('profile/name/:originalProfileName')
  async updateProfileName (
    @Param('originalProfileName') originalProfileName: string,
    @Headers('userId') userId: string,
    @Body('newProfileName') newProfileName: string,
  ) {
    await this.usersService.updateProfileName({
      userId,
      originalProfileName,
      newProfileName,
    })
    return Helper.parseResponseBody({ data: '' })
  }

  @Post('/login')
  async login (
    @Body('userId') userId: string,
    @Body('password') password: string,
  ) {
    return await this.usersService.login({ userId, password })
  }

  @Patch('login-log/:userId')
  async updateUserLog (@Headers('userId') userId: string) {
    await this.usersService.updateUserLog({ userId })
    return Helper.parseResponseBody()
  }

  @Get('share-link/:sharedLinkId')
  async getTmpLinkData (
    @Headers('userId') userId: string,
    @Param() params: SharedLinkParamGetDTO,
  ) {
    const data = await this.usersService.getSharedlinkData({
      sharedLinkId: params.sharedLinkId,
    })
    return Helper.parseResponseBody({ data: data })
  }

  @Post('share-link')
  async createTmpLinkData (
    @Headers('userId') userId: string,
    @Body('data') data: SharedLinkDataCreateDTO,
  ) {
    const sharedLinkId = await this.usersService.createSharedlinkData({ data })

    Helper.actionLogging(userId, 'ShareLink', sharedLinkId)

    return Helper.parseResponseBody({ data: { sharedLinkId: sharedLinkId } })
  }
}
