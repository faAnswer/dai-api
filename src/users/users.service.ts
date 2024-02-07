import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { DatabaseError, LoginFailedError } from '@src/common/error'
import Helper from '@src/common/helper'
const fs = require('fs')
const { customAlphabet } = require('nanoid')
import { Cron } from '@nestjs/schedule'
import envConfig from '@src/common/config/env'
import apiClient from '@src/modules/apiClient'
import pathConfig from '@src/common/config/pathConfig'
import { ProfileDataType, SharedLinkDataType } from '@src/common/model'
const dayjs = require('dayjs')

@Injectable()
export class UsersService {
  async getProfile ({
    userId,
    withFilePath = false,
  }: {
    userId: string
    withFilePath: boolean
  }) {
    try {
      const profileFilePathList = await Helper.getAllFilesPathFromFolder({
        folderPath: `data/user/${userId}/profile`,
      })
      const profileDataList = await this.findAllProfileDataList({
        profileFilePathList,
        withFilePath,
      })
      return profileDataList
    } catch (error) {
      // console.log(error)
      throw new HttpException(
        'No User Profile File is found!',
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  async findAllProfileDataList ({
    profileFilePathList,
    withFilePath,
  }: {
    profileFilePathList: Array<string> | []
    withFilePath: boolean
  }) {
    const profileDataList = []
    for (const profileFilePath of profileFilePathList) {
      if (profileFilePath.includes('.gitkeep')) {
        continue
      }
      const data = fs.readFileSync(profileFilePath, {
        encoding: 'utf8',
        flag: 'r',
      })
      const resultData = withFilePath
        ? { ...JSON.parse(data), filePath: profileFilePath }
        : JSON.parse(data)
      profileDataList.push(resultData)
    }
    return profileDataList
  }

  async updateProfile ({
    profileData,
    userId,
  }: {
    profileData: ProfileDataType
    userId: string
  }) {
    const withFilePath = true
    if (profileData['excel']) {
      profileData['excel'].forEach((excelData: { isActive: any }) => {
        delete excelData.isActive
      })
    }

    const profileDataList = await this.getProfile({ userId, withFilePath })
    const record = profileDataList.find(data => data.name === profileData.name)
    profileData['input'] =
      profileData['input'].length > 0 ? profileData['input'] : record['input']
    try {
      fs.writeFileSync(record.filePath, JSON.stringify(profileData, null, 4), {
        encoding: 'utf8',
        flag: 'w',
      })
    } catch (error) {
      console.log(error)
      throw new DatabaseError('Save Profile Error!')
    }
  }

  async saveProfile ({
    profileData,
    userId,
  }: {
    profileData: ProfileDataType
    userId: string
  }) {
    try {
      if (profileData['excel']) {
        profileData['excel'].forEach((excelData: { isActive: any }) => {
          delete excelData.isActive
        })
      }
      fs.writeFileSync(
        `data/user/${userId}/profile/${profileData['name']}.json`,
        JSON.stringify(profileData, null, 4),
        {
          encoding: 'utf8',
          flag: 'w',
        },
      )
    } catch (error) {
      console.log(error)
      throw new DatabaseError('Save Profile Error!')
    }
  }

  async deleteProfile ({
    userId,
    profileName,
  }: {
    userId: string
    profileName: string
  }) {
    const withFilePath = true
    const profileDataList = await this.getProfile({ userId, withFilePath })
    const profileFound = profileDataList.find(
      profileData => profileData.name === profileName,
    )
    if (!profileFound) {
      throw new HttpException(
        'No User Profile File is found!',
        HttpStatus.BAD_REQUEST,
      )
    }
    try {
      Helper.deleteFile({ filePath: profileFound.filePath })
    } catch (error) {
      throw new HttpException('Delete Profile Error', HttpStatus.BAD_REQUEST)
    }
  }

  async updateProfileName ({
    userId,
    newProfileName,
    originalProfileName,
  }: {
    userId: string
    newProfileName: string
    originalProfileName: string
  }) {
    const withFilePath = true
    const profileDataList = await this.getProfile({ userId, withFilePath })
    const profileFound = profileDataList.find(
      profileData => profileData.name === originalProfileName,
    )
    if (!profileFound) {
      throw new HttpException(
        'No User Profile File is found!',
        HttpStatus.BAD_REQUEST,
      )
    }
    profileFound.lastUpdateDate = dayjs().format()
    profileFound.name = newProfileName
    try {
      const filePath = profileFound.filePath
      delete profileFound.filePath

      await Helper.writeFile({
        folderPath: filePath,
        content: JSON.stringify(profileFound, null, 4),
        mode: 'OVERWRITE',
      })

      await Helper.renameFile({
        currentFilePath: filePath,
        newFileName: newProfileName + '.json',
      })
    } catch (error) {
      console.log(error)
      throw new HttpException(
        'Update Profile Name Error',
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  async updateUserLog ({ userId }: { userId: string }) {
    const userFolderPath = `data/user/${userId}`
    const isFolderExist = await Helper.isFolderExist({ path: userFolderPath })
    if (!isFolderExist) {
      try {
        await this.createUserFolder({ userFolderPath })
      } catch (error) {
        console.log(error)
        throw new DatabaseError('create user log error!')
      }
    }

    try {
      await this.updateUserLoginRecord({
        userLogFilePath: `${userFolderPath}/logs/auth.txt`,
      })
    } catch (error) {
      console.log(error)
      throw new DatabaseError('update user log error!')
    }
  }

  async createUserFolder ({ userFolderPath }: { userFolderPath: string }) {
    try {
      // read profile template
      const singleStockProfileTemplatePath =
        envConfig.singleStockProfileTemplatePath
      const portfolioProfileTemplatePath =
        envConfig.portfolioProfileTemplatePath
      const singleStockProfileData = await Helper.readFile({
        folderPath: singleStockProfileTemplatePath,
      })
      const portfolioProfileData = await Helper.readFile({
        folderPath: portfolioProfileTemplatePath,
      })

      // create Folder
      await Helper.createFolder({ folderPath: userFolderPath })
      await Helper.createFolder({ folderPath: `${userFolderPath}/excel` })
      await Helper.createFolder({ folderPath: `${userFolderPath}/logs` })
      await Helper.createFolder({ folderPath: `${userFolderPath}/profile` })
      await Helper.createFile({
        folderPath: `${userFolderPath}/logs/auth.txt`,
        content: '',
      })
      await Helper.createFile({
        folderPath: `${userFolderPath}/logs/auth.txt`,
        content: '',
      })
      await Helper.createFile({
        folderPath: `${userFolderPath}/profile/portfolio-template.json`,
        content: portfolioProfileData,
      })
      await Helper.createFile({
        folderPath: `${userFolderPath}/profile/single-stock-template.json`,
        content: singleStockProfileData,
      })
      // await Helper.createFile({
      //   folderPath: `${userFolderPath}/excel/.gitkeep`,
      //   content: '',
      // })
      // await Helper.createFile({
      //   folderPath: `${userFolderPath}/logs/.gitkeep`,
      //   content: '',
      // })

      // await Helper.createFile({
      //   folderPath: `${userFolderPath}/profile/.gitkeep`,
      //   content: '',
      // })
    } catch (error) {
      console.log(error)
      throw new DatabaseError('create user folder error')
    }
  }

  async login ({ userId, password }: { userId: string; password: string }) {
    const response = await apiClient.post(pathConfig.login(), {
      userid: userId,
      password: password,
    })
    if (response.login === 1) {
      Helper.actionLogging(userId, 'Login', 'success')
      this.updateUserLog({ userId })
    } else {
      Helper.actionLogging(userId, 'Login', 'fail')
    }
    return response
  }

  async updateUserLoginRecord ({
    userLogFilePath,
  }: {
    userLogFilePath: string
  }) {
    const lastAuthLog = await Helper.readFile({ folderPath: userLogFilePath })
    const currentTimeString = await Helper.getCurrentTimeString()
    const updatedAuthLog = lastAuthLog
      ? [...JSON.parse(lastAuthLog), { loginTime: currentTimeString }]
      : [{ loginTime: currentTimeString }]

    await Helper.writeFile({
      folderPath: userLogFilePath,
      content: JSON.stringify(updatedAuthLog, null, 4),
      mode: 'OVERWRITE',
    })
  }

  async createSharedlinkData ({ data }: { data: SharedLinkDataType }) {
    const getNanoid = customAlphabet('1234567890qwertyuiopasdfghjklzxcvbnm', 20)
    const nanoid = getNanoid()
    const sharedLinkDate = { ...data, createdDate: dayjs() }
    try {
      fs.writeFileSync(
        `data/shared-link/${nanoid}.json`,
        JSON.stringify(sharedLinkDate, null, 4),
        {
          encoding: 'utf8',
          flag: 'w',
        },
      )
    } catch (error) {
      console.log(error)
      throw new DatabaseError('Save Share Link Data Error!')
    }
    return nanoid
  }

  async getSharedlinkData ({ sharedLinkId }: { sharedLinkId: string }) {
    try {
      // console.log(sharedLinkId)
      const decodedData = fs.readFileSync(
        `data/shared-link/${sharedLinkId}.json`,
        {
          encoding: 'utf8',
          flag: 'r',
        },
      )
      const data = JSON.parse(decodedData)
      return data
    } catch (error) {
      // console.log(error)
      throw new HttpException(
        'No User Profile File is found!',
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  @Cron('0 * * * * *')
  removeSharedlinkData () {
    const sharedLinkFolder = 'data/shared-link'
    const expiredLinkFolder = 'data/expired-link'
    fs.readdirSync(__dirname + `/../../../${sharedLinkFolder}`).forEach(
      (file: string) => {
        if (file !== '.gitkeep') {
          const filePath = `${sharedLinkFolder}/${file}`
          const newFilePath = `${expiredLinkFolder}/${file}`
          const data = require(__dirname + `/../../../${filePath}`)
          if (
            dayjs().diff(dayjs(data.createdDate)) >
            envConfig.removeSharedlinkDataTime
          ) {
            fs.rename(filePath, newFilePath, function (err: any) {
              if (err) throw err
              // console.log('moved file!')
            })
          }
        }
      },
    )
  }
}
