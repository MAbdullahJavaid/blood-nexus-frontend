
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2 } from "lucide-react";

const patientInvoiceSchema = z.object({
  patient_type: z.enum(["Regular", "OPD"]),
  patient_id: z.string().optional(),
  patient_name: z.string().optional(),
  hospital_name: z.string().optional(),
  phone_no: z.string().optional(),
  gender: z.string().optional(),
  dob: z.string().optional(),
  age: z.number().optional(),
  blood_group_separate: z.string().optional(),
  rh_factor: z.string().optional(),
  blood_category: z.string().optional(),
  bottle_quantity: z.number().optional(),
  bottle_unit: z.string().optional(),
  document_date: z.string(),
  ex_donor: z.string().optional(),
  reference_notes: z.string().optional(),
  total_amount: z.number().default(0),
  amount_received: z.number().default(0),
  discount_amount: z.number().default(0),
});

type PatientInvoiceFormData = z.infer<typeof patientInvoiceSchema>;

interface InvoiceItem {
  test_name: string;
  quantity: number;
  test_rate: number;
  amount: number;
}

const PatientInvoiceForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    { test_name: "", quantity: 1, test_rate: 0, amount: 0 }
  ]);

  const form = useForm<PatientInvoiceFormData>({
    resolver: zodResolver(patientInvoiceSchema),
    defaultValues: {
      patient_type: "Regular",
      document_date: new Date().toISOString().split('T')[0],
      total_amount: 0,
      amount_received: 0,
      discount_amount: 0,
    },
  });

  const addInvoiceItem = () => {
    setInvoiceItems([...invoiceItems, { test_name: "", quantity: 1, test_rate: 0, amount: 0 }]);
  };

  const removeInvoiceItem = (index: number) => {
    if (invoiceItems.length > 1) {
      const newItems = invoiceItems.filter((_, i) => i !== index);
      setInvoiceItems(newItems);
      updateTotalAmount(newItems);
    }
  };

  const updateInvoiceItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...invoiceItems];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Calculate amount for this item
    if (field === 'quantity' || field === 'test_rate') {
      newItems[index].amount = newItems[index].quantity * newItems[index].test_rate;
    }
    
    setInvoiceItems(newItems);
    updateTotalAmount(newItems);
  };

  const updateTotalAmount = (items: InvoiceItem[]) => {
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    form.setValue('total_amount', total);
  };

  const onSubmit = async (data: PatientInvoiceFormData) => {
    setIsSubmitting(true);
    
    try {
      // Generate document number
      const { data: docNumber, error: docError } = await supabase
        .rpc('generate_document_number');
      
      if (docError) throw docError;

      // Prepare the invoice data to match the database schema exactly
      const invoiceData = {
        document_no: docNumber,
        patient_type: data.patient_type,
        patient_id: data.patient_id || null,
        patient_name: data.patient_name || null,
        hospital_name: data.hospital_name || null,
        phone_no: data.phone_no || null,
        gender: data.gender || null,
        dob: data.dob || null,
        age: data.age || null,
        blood_group_separate: data.blood_group_separate || null,
        rh_factor: data.rh_factor || null,
        blood_category: data.blood_category || null,
        bottle_quantity: data.bottle_quantity || null,
        bottle_unit: data.bottle_unit || null,
        document_date: data.document_date,
        ex_donor: data.ex_donor || null,
        reference_notes: data.reference_notes || null,
        total_amount: data.total_amount || 0,
        amount_received: data.amount_received || 0,
        discount_amount: data.discount_amount || 0,
      };

      // Insert patient invoice
      const { data: invoice, error: invoiceError } = await supabase
        .from('patient_invoices')
        .insert(invoiceData)
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Insert invoice items
      const itemsToInsert = invoiceItems
        .filter(item => item.test_name.trim() !== '')
        .map(item => ({
          invoice_id: invoice.id,
          test_name: item.test_name,
          quantity: item.quantity,
          test_rate: item.test_rate,
          amount: item.amount,
        }));

      if (itemsToInsert.length > 0) {
        const { error: itemsError } = await supabase
          .from('patient_invoice_items')
          .insert(itemsToInsert);

        if (itemsError) throw itemsError;
      }

      toast.success(`Patient invoice created successfully! Document No: ${docNumber}`);
      
      // Reset form
      form.reset();
      setInvoiceItems([{ test_name: "", quantity: 1, test_rate: 0, amount: 0 }]);
      
    } catch (error) {
      console.error('Error creating patient invoice:', error);
      toast.error('Failed to create patient invoice. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Patient Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Patient Type and Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="patient_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select patient type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Regular">Regular</SelectItem>
                          <SelectItem value="OPD">OPD</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="patient_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter patient ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="document_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Patient Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="patient_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter patient name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hospital_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hospital Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter hospital name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Blood Group and Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="blood_group_separate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Group</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="AB">AB</SelectItem>
                          <SelectItem value="O">O</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rh_factor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RH Factor</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select RH factor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="+ve">+ve</SelectItem>
                          <SelectItem value="-ve">-ve</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Enter age" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Invoice Items */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Invoice Items</h3>
                  <Button type="button" onClick={addInvoiceItem} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                <div className="space-y-4">
                  {invoiceItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                      <div>
                        <label className="text-sm font-medium">Test Name</label>
                        <Input
                          placeholder="Enter test name"
                          value={item.test_name}
                          onChange={(e) => updateInvoiceItem(index, 'test_name', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Quantity</label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateInvoiceItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Rate</label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.test_rate}
                          onChange={(e) => updateInvoiceItem(index, 'test_rate', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Amount</label>
                        <Input
                          type="number"
                          value={item.amount.toFixed(2)}
                          readOnly
                          className="bg-gray-50"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeInvoiceItem(index)}
                          disabled={invoiceItems.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Financial Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="total_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Amount</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          readOnly
                          className="bg-gray-50"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discount_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Amount</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="Enter discount amount"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount_received"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount Received</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="Enter amount received"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Additional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ex_donor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ex-Donor</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter ex-donor information" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reference_notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter reference notes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setInvoiceItems([{ test_name: "", quantity: 1, test_rate: 0, amount: 0 }]);
                  }}
                >
                  Reset
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Invoice"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientInvoiceForm;
