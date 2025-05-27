import React, { useState } from 'react'
import { 
  Bell, 
  User, 
  Store, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Facebook, 
  Instagram, 
  Twitter, 
  Save,
  AlertTriangle
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function SettingsPage() {
  // Store settings
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'Hugsy Finds',
    storeEmail: 'contact@hugsyfinds.com',
    storePhone: '+1 (555) 123-4567',
    storeAddress: '123 Cozy Lane, Comfort City, CC 12345',
    storeDescription: 'Hugsy Finds offers handcrafted, eco-friendly children\'s toys and accessories that bring joy and comfort to little ones while being kind to our planet.',
    currency: 'USD',
    taxRate: 8.5,
    shippingFee: 5.99,
    freeShippingThreshold: 50,
    websiteUrl: 'https://hugsyfinds.com',
    facebookUrl: 'https://facebook.com/hugsyfinds',
    instagramUrl: 'https://instagram.com/hugsyfinds',
    twitterUrl: 'https://twitter.com/hugsyfinds'
  })

  // User profile settings
  const [userProfile, setUserProfile] = useState({
    name: 'Admin User',
    email: 'admin@hugsyfinds.com',
    role: 'Administrator',
    avatar: null,
    password: '',
    confirmPassword: ''
  })

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    orderNotifications: true,
    stockAlerts: true,
    customerMessages: true,
    marketingUpdates: false,
    emailNotifications: true,
    browserNotifications: false,
    dailyDigest: true,
    weeklyReport: true
  })

  // Handle store settings change
  const handleStoreSettingsChange = (e) => {
    const { name, value } = e.target
    setStoreSettings({
      ...storeSettings,
      [name]: value
    })
  }

  // Handle user profile change
  const handleUserProfileChange = (e) => {
    const { name, value } = e.target
    setUserProfile({
      ...userProfile,
      [name]: value
    })
  }

  // Handle notification toggle
  const handleNotificationToggle = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    })
  }

  // Handle avatar upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // In a real app, you would upload this to a server
      // For now, we'll just create a local URL
      const reader = new FileReader()
      reader.onload = () => {
        setUserProfile({
          ...userProfile,
          avatar: reader.result
        })
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle store settings save
  const handleStoreSettingsSave = (e) => {
    e.preventDefault()
    // In a real app, you would save this to a server
    alert('Store settings saved successfully!')
  }

  // Handle user profile save
  const handleUserProfileSave = (e) => {
    e.preventDefault()
    
    // Validate password match if changing password
    if (userProfile.password && userProfile.password !== userProfile.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    
    // In a real app, you would save this to a server
    alert('User profile saved successfully!')
  }

  // Handle notification settings save
  const handleNotificationSettingsSave = (e) => {
    e.preventDefault()
    // In a real app, you would save this to a server
    alert('Notification settings saved successfully!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-gray-500">Manage your store settings and preferences.</p>
      </div>

      <Tabs defaultValue="store" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="store">
            <Store className="mr-2 h-4 w-4" />
            Store Settings
          </TabsTrigger>
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            User Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Store Settings Tab */}
        <TabsContent value="store">
          <form onSubmit={handleStoreSettingsSave}>
            <Card>
              <CardHeader>
                <CardTitle>Store Information</CardTitle>
                <CardDescription>
                  Manage your store details and contact information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input
                      id="storeName"
                      name="storeName"
                      value={storeSettings.storeName}
                      onChange={handleStoreSettingsChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeEmail">Email Address</Label>
                    <Input
                      id="storeEmail"
                      name="storeEmail"
                      type="email"
                      value={storeSettings.storeEmail}
                      onChange={handleStoreSettingsChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="storePhone">Phone Number</Label>
                    <Input
                      id="storePhone"
                      name="storePhone"
                      value={storeSettings.storePhone}
                      onChange={handleStoreSettingsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="websiteUrl">Website URL</Label>
                    <Input
                      id="websiteUrl"
                      name="websiteUrl"
                      value={storeSettings.websiteUrl}
                      onChange={handleStoreSettingsChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storeAddress">Store Address</Label>
                  <Textarea
                    id="storeAddress"
                    name="storeAddress"
                    value={storeSettings.storeAddress}
                    onChange={handleStoreSettingsChange}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storeDescription">Store Description</Label>
                  <Textarea
                    id="storeDescription"
                    name="storeDescription"
                    value={storeSettings.storeDescription}
                    onChange={handleStoreSettingsChange}
                    rows={3}
                  />
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select 
                      value={storeSettings.currency}
                      onValueChange={(value) => setStoreSettings({...storeSettings, currency: value})}
                    >
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                        <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      name="taxRate"
                      type="number"
                      step="0.01"
                      min="0"
                      value={storeSettings.taxRate}
                      onChange={handleStoreSettingsChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="shippingFee">Default Shipping Fee</Label>
                    <Input
                      id="shippingFee"
                      name="shippingFee"
                      type="number"
                      step="0.01"
                      min="0"
                      value={storeSettings.shippingFee}
                      onChange={handleStoreSettingsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="freeShippingThreshold">Free Shipping Threshold</Label>
                    <Input
                      id="freeShippingThreshold"
                      name="freeShippingThreshold"
                      type="number"
                      step="0.01"
                      min="0"
                      value={storeSettings.freeShippingThreshold}
                      onChange={handleStoreSettingsChange}
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                <h3 className="text-lg font-medium">Social Media Links</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="facebookUrl" className="flex items-center">
                      <Facebook className="mr-2 h-4 w-4" />
                      Facebook
                    </Label>
                    <Input
                      id="facebookUrl"
                      name="facebookUrl"
                      value={storeSettings.facebookUrl}
                      onChange={handleStoreSettingsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagramUrl" className="flex items-center">
                      <Instagram className="mr-2 h-4 w-4" />
                      Instagram
                    </Label>
                    <Input
                      id="instagramUrl"
                      name="instagramUrl"
                      value={storeSettings.instagramUrl}
                      onChange={handleStoreSettingsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitterUrl" className="flex items-center">
                      <Twitter className="mr-2 h-4 w-4" />
                      Twitter
                    </Label>
                    <Input
                      id="twitterUrl"
                      name="twitterUrl"
                      value={storeSettings.twitterUrl}
                      onChange={handleStoreSettingsChange}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="ml-auto">
                  <Save className="mr-2 h-4 w-4" />
                  Save Store Settings
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        {/* User Profile Tab */}
        <TabsContent value="profile">
          <form onSubmit={handleUserProfileSave}>
            <Card>
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
                <CardDescription>
                  Manage your personal information and account settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={userProfile.avatar || ''} />
                    <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Label htmlFor="avatar">Profile Picture</Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                    />
                    <p className="text-xs text-gray-500">
                      Recommended: Square image, at least 300x300px
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={userProfile.name}
                      onChange={handleUserProfileChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={userProfile.email}
                      onChange={handleUserProfileChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    value={userProfile.role}
                    onValueChange={(value) => setUserProfile({...userProfile, role: value})}
                    disabled
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administrator">Administrator</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Editor">Editor</SelectItem>
                      <SelectItem value="Viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Role changes must be made by a system administrator
                  </p>
                </div>

                <Separator className="my-4" />

                <h3 className="text-lg font-medium">Change Password</h3>
                <Alert variant="outline" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Password Security</AlertTitle>
                  <AlertDescription>
                    Use a strong password that you don't use elsewhere. Passwords should be at least 8 characters and include numbers and symbols.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={userProfile.password}
                      onChange={handleUserProfileChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={userProfile.confirmPassword}
                      onChange={handleUserProfileChange}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Leave blank to keep your current password
                </p>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="ml-auto">
                  <Save className="mr-2 h-4 w-4" />
                  Save Profile
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <form onSubmit={handleNotificationSettingsSave}>
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose what notifications you want to receive and how you want to receive them.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-medium">Notification Types</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="orderNotifications">Order Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Receive notifications about new orders and order status changes
                      </p>
                    </div>
                    <Switch
                      id="orderNotifications"
                      checked={notificationSettings.orderNotifications}
                      onCheckedChange={() => handleNotificationToggle('orderNotifications')}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="stockAlerts">Stock Alerts</Label>
                      <p className="text-sm text-gray-500">
                        Get notified when products are low in stock or out of stock
                      </p>
                    </div>
                    <Switch
                      id="stockAlerts"
                      checked={notificationSettings.stockAlerts}
                      onCheckedChange={() => handleNotificationToggle('stockAlerts')}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="customerMessages">Customer Messages</Label>
                      <p className="text-sm text-gray-500">
                        Receive notifications about new customer inquiries and messages
                      </p>
                    </div>
                    <Switch
                      id="customerMessages"
                      checked={notificationSettings.customerMessages}
                      onCheckedChange={() => handleNotificationToggle('customerMessages')}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketingUpdates">Marketing Updates</Label>
                      <p className="text-sm text-gray-500">
                        Get updates about marketing campaigns and promotions
                      </p>
                    </div>
                    <Switch
                      id="marketingUpdates"
                      checked={notificationSettings.marketingUpdates}
                      onCheckedChange={() => handleNotificationToggle('marketingUpdates')}
                    />
                                    </div>
                </div>

                <Separator className="my-6" />

                <h3 className="text-lg font-medium">Notification Delivery</h3>
                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="browserNotifications">Browser Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Receive notifications in your browser when you're logged in
                      </p>
                    </div>
                    <Switch
                      id="browserNotifications"
                      checked={notificationSettings.browserNotifications}
                      onCheckedChange={() => handleNotificationToggle('browserNotifications')}
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                <h3 className="text-lg font-medium">Summary Reports</h3>
                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dailyDigest">Daily Digest</Label>
                      <p className="text-sm text-gray-500">
                        Receive a daily summary of all store activities
                      </p>
                    </div>
                    <Switch
                      id="dailyDigest"
                      checked={notificationSettings.dailyDigest}
                      onCheckedChange={() => handleNotificationToggle('dailyDigest')}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="weeklyReport">Weekly Report</Label>
                      <p className="text-sm text-gray-500">
                        Receive a weekly analytics and sales report
                      </p>
                    </div>
                    <Switch
                      id="weeklyReport"
                      checked={notificationSettings.weeklyReport}
                      onCheckedChange={() => handleNotificationToggle('weeklyReport')}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="ml-auto">
                  <Save className="mr-2 h-4 w-4" />
                  Save Notification Settings
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}